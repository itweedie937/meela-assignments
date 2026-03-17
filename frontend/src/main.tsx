import { createRoot } from 'react-dom/client'
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MainMenu from './MainMenu'
import { Typography } from '@mui/material';

createRoot(document.getElementById('root')!).render(
<React.Fragment>
	<CssBaseline />
	<Container sx={{margin: 7}}>
		<Typography
			component="h1"
			variant="h4"
			sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', margin: '10px' }}>
			Meela
		</Typography>
		<Typography
			component="h4"
			variant="body1"
			sx={{ width: '100%', margin: '10px' }}>
			Welcome! We need some details in order to move forward. Fill these in at your own pace; they will be saved as you go.
		</Typography>
		<MainMenu />
	</Container>
	</React.Fragment>
)


