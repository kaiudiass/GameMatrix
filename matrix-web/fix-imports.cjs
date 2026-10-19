const fs = require('fs');
const path = require('path');

const pages = ['AuthPage', 'LobbyPage', 'MatchPage', 'VictoryPage'];

pages.forEach(page => {
  const filePath = path.join(__dirname, 'src', 'pages', page, `${page}.jsx`);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/'\.\.\/components\//g, "'../../components/");
    content = content.replace(/'\.\.\/service\//g, "'../../service/");
    content = content.replace(/'\.\.\/mock\//g, "'../../mock/");
    fs.writeFileSync(filePath, content);
  }
});

console.log('Fixed relative imports in page components.');
