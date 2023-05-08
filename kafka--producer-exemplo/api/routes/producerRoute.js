module.exports = app => {
    const controller = require('../controllers/producerController')();
  
    app.route('/mensagem')
      .post(controller.postarMensagem);
  }