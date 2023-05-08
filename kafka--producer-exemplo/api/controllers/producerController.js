module.exports = () => {
    const controller = {};
  
    controller.postarMensagem = (req, res) => {

        console.log(`Campos - Mensagem: ${req.body["mensagem"]} Saldo: ${req.body["saldo"]}`)
        
        res.status(200).json("Sucesso");
    }

  
    return controller;
}

function consumer(){


const { Kafka } = require('kafkajs')

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
    clientId: 'my-app',
    // authenticationTimeout: 10000,
    // reauthenticationThreshold: 10000,
    ssl: true,
    sasl: {
      mechanism: 'oauthbearer',
      oauthBearerProvider: async () => {
        // Use an unsecured token...
        const token = jwt.sign({ sub: 'test' }, 'abc', { algorithm: 'none' })
  
        // ...or, more realistically, grab the token from some OAuth endpoint
  
        return {
          value: token
        }
      }
    },
  })


}