use std::env;
use uuid::Uuid;
use serde::{Deserialize, Serialize};

use log::info;
use poem::{
    EndpointExt, Route, Server,
    endpoint::{StaticFileEndpoint, StaticFilesEndpoint},
    error::ResponseError,
    get, post, handler,
    http::StatusCode,
    listener::TcpListener,
    web::{Data, Json, Path},
};
use sqlx::{SqlitePool, Row};
use poem::middleware::Cors;

#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Sqlx(#[from] sqlx::Error),
    #[error(transparent)]
    Var(#[from] std::env::VarError),
    #[error(transparent)]
    Dotenv(#[from] dotenv::Error),
    #[error("Query failed")]
    QueryFailed,
    #[error(transparent)]
    Json(#[from] serde_json::Error),
}

impl ResponseError for Error {
    fn status(&self) -> StatusCode {
        StatusCode::INTERNAL_SERVER_ERROR
    }
}

async fn init_pool() -> Result<SqlitePool, Error> {
    let pool = SqlitePool::connect(&env::var("DATABASE_URL")?).await?;
    init_db(&pool).await?;
    Ok(pool)
}

async fn init_db(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(
        "
        CREATE TABLE IF NOT EXISTS form_submissions (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        "
    )
    .execute(pool)
    .await?;

    Ok(())
}


#[derive(Serialize)]
struct CreateResponse {
    id: String,
}

#[derive(Serialize)]
struct GetSubmission {
    id: String,
    data: serde_json::Value,
}

#[derive(Deserialize)]
struct SubmissionPayload {
    #[serde(rename = "formData")]
    form_data: serde_json::Value,
    #[serde(rename = "currentStep")]
    current_step: i32,
}

#[derive(Serialize)]
struct UpdateSubmission {
    ok: bool
}

#[handler]
async fn create_submission(
    Data(pool): Data<&SqlitePool>,
) -> Result<Json<CreateResponse>, Error> {
    // generates new ID string
    let id = Uuid::new_v4().to_string();

    // adds the submission "user" to the db so that their data is saved
    sqlx::query(
        "INSERT INTO form_submissions (id, data) VALUES (?, ?)"
    )
    .bind(&id)
    .bind("{}")
    .execute(pool)
    .await?;

    Ok(Json(CreateResponse { id }))
}

#[handler]
async fn get_submission(
    Data(pool): Data<&SqlitePool>,
    Path(id): Path<String>,
) -> Result<Json<GetSubmission>, Error> {
    // selects the record where the id matches
    let row = sqlx::query(
            "SELECT * FROM form_submissions WHERE id = ?"
        )
        .bind(&id)
        .fetch_optional(pool)
        .await?;

    let Some(row) = row else {
        Err(Error::QueryFailed)?
    };

    let data_str: String = row.try_get("data")?;
    let data: serde_json::Value = serde_json::from_str(&data_str)?;

    Ok(Json(GetSubmission { id, data }))
}

#[handler]
async fn update_submission(
    Data(pool): Data<&SqlitePool>,
    Path(id): Path<String>,
    Json(payload): Json<SubmissionPayload>,
) -> Result<Json<UpdateSubmission>, Error> {
    let data = serde_json::json!({
        "formData": payload.form_data,
        "currentStep": payload.current_step,
    })
    .to_string();

    sqlx::query(
        "UPDATE form_submissions SET data = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?",
    )
    .bind(&data)
    .bind(&id)
    .execute(pool)
    .await?;

    Ok(Json(UpdateSubmission { ok: true }))
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    dotenv::dotenv()?;
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    info!("Initialize db pool");
    let pool = init_pool().await?;
    let app = Route::new()
        .at("/submissions", post(create_submission))
        .at(
            "/submissions/:id", 
            get(get_submission).put(update_submission)
        )
        .at("/favicon.ico", StaticFileEndpoint::new("www/favicon.ico"))
        .nest("/static/", StaticFilesEndpoint::new("www"))
        .at("*", StaticFileEndpoint::new("www/index.html"))
        .data(pool)
        .with(
            Cors::new()
                .allow_origin("http://localhost:5173")
                .allow_origin("http://127.0.0.1:5173")
                .allow_methods(vec!["GET", "POST", "PUT"])
                .allow_headers(vec!["content-type"]),
        );
    Server::new(TcpListener::bind("0.0.0.0:3005"))
        .run(app)
        .await?;

    Ok(())
}
