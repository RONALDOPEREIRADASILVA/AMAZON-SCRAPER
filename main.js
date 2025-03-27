
//Importa a biblioteca Axios para fazer requisições HTTP
import axios from 'axios';
//Obtém refêrencias para os elementos HTML relevantes usando seus IDs
const keywordInput = document.getElementById('keyword');
const scrapeButton = document.getElementById('scrapeButton');
const resultsDiv = document.getElementById('results');
// Adiciona um ouvinte de evento de clique ao botão "scrapeButton"
scrapeButton.addEventListener('click', async () => {
   // Obtém o valor do campo de entrada "keyword"
  const keyword = keywordInput.value;
   // Verifica se o campo de entrada está vazio
  if (!keyword) {
     // Se estiver vazio, exibe um alerta pedindo para inserir uma palavra-chave
    return alert('Please enter a keyword');
  }
  try {
    // Faz uma requisição GET para a API no endpoint '/api/scrape' com a palavra-chave
    const response = await axios.get(`http://localhost:3000/api/scrape?keyword=${keyword}`);
     // Extrai os dados da resposta, que devem ser um array de produtos
    const products = response.data;
     // Chama a função para exibir os resultados na página
    displayResults(products);
  } catch (error) {
    // Se ocorrer um erro na requisição, exibe o erro no console e um alerta
    console.error(error);
    alert('An error occurred');
  }
});
// Função para exibir os resultados na div "results"
function displayResults(products) {
  // Limpa o conteúdo anterior da div "results"
  resultsDiv.innerHTML = '';
   // Itera sobre o array de produtos
  products.forEach(product => {
     // Cria um novo elemento div para cada produto
    const productDiv = document.createElement('div');
     // Define o conteúdo HTML do elemento div do produto
    productDiv.innerHTML = `
      <h2>${product.title}</h2>
      <p>Rating: ${product.rating}</p>
      <p>Reviews: ${product.reviews}</p>
      <img src="${product.image}" alt="${product.title}" style="width: 100px;">
    `;
     // Adiciona o elemento div do produto à div "results"
    resultsDiv.appendChild(productDiv);
  });
}