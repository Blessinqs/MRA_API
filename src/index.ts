import swaggerDocs from './swagger';
import cors from 'cors';
import terminalRoutes from './routes/terminal';
import validationRoutes from './routes/validation';
import transactionRoutes from './routes/transaction';
import { ClientTaxPayerDetail,Schema } from './models/Models';
import bodyParser from 'body-parser';
import { app, options, port } from './utils/services';

app.use(bodyParser.json());
// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(options))
swaggerDocs(app, parseInt(port));

Schema.authenticate()
  .then(async ()=>{
    app.listen(port, async () => {
        app.use("/api/terminal",terminalRoutes);
        app.use("/api/transaction",transactionRoutes);
        app.use("/api/validations",validationRoutes);
        // await Schema.drop();
        // await Schema.sync({ alter:true, force:true });
        console.log(`Server/DB is running at ${port}`);
    })
}).catch((error:any) => console.log(error))
