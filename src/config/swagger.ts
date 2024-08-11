import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Retail Manager API',
      version: '1.0.0',
      description: 'API documentation for the Retail Manager',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./routers/*.ts', './controllers/*.ts'], // Sesuaikan dengan path file TS kamu
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
