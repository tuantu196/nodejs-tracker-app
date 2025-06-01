import express from 'express';
import authRoute from './features/auth/authRoute.ts';
import responseEnhancer from './middleware/responseHelper.ts'
import 'dotenv/config'
import taskRoute from './features/task/taskRoute.ts';
import logMiddleware from './middleware/log.ts';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(responseEnhancer)
app.use(logMiddleware)

app.use('/api/route', authRoute);
app.use('/task', taskRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);