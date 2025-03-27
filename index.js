const express = require('express');
const axios = require('axios');
const jsdom = require('jsdom');
const app = express();
const port = 3000;

app.get('/api/scrape', async (req, res) => {
  try {
    // 1. Obter a palavra-chave da consulta
    const keyword = req.query.keyword;

    // 2. Verificar se a palavra-chave foi fornecida
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    // 3. Fazer a solicitação HTTP para a Amazon com atraso
    await new Promise(resolve => setTimeout(resolve, 5000)); // Adiciona um atraso de 5 segundos
    const response = await axios.get(`https://www.amazon.com.br/s?k=${keyword}`);

    // 4. Criar um objeto jsdom a partir da resposta HTML
    const dom = new jsdom.JSDOM(response.data);

    // 5. Carregar jQuery no contexto jsdom
    const $ = require('jquery')(dom.window);

    // 6. Extrair dados dos produtos da Amazon
    const products = $('.s-result-item').map((i, el) => {
      const title = $(el).find('h2 a span').text().trim();
      const rating = $(el).find('.a-icon-star-small').attr('aria-label');
      const reviews = $(el).find('.a-size-small.a-link-normal').text().trim();
      const image = $(el).find('img').attr('src');

      return { title, rating, reviews, image };
    }).get();

    // 7. Enviar os dados do produto como JSON
    res.json(products);
  } catch (error) {
    // 8. Registrar o erro no console para depuração
    console.error('Erro ao fazer scraping da Amazon:', error);

    // 9. Enviar um erro 500 com uma mensagem mais descritiva
    res.status(500).json({ error: 'Erro ao fazer scraping da Amazon' });
  }
});

app.get('/', (req, res) => {
  res.send('Bem-vindo ao meu servidor!');
});

app.listen(port, () => {
  console.log(`Servidor ouvindo em http://localhost:${port}`);
});