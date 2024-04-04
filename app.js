const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const dotenv = require('dotenv').config()

// View engine setup
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));

// API Key ve model adı
const API_KEY = "API_KEY";
const MODEL_NAME = "gemini-1.0-pro";

// Ana sayfa
app.get("/", (req, res) => {
    res.render("index");
});

// Hakkında sayfası
app.get("/about", (req, res) => {
    res.render("about");
});

// İletişim sayfası
app.get("/contact", (req, res) => {
    res.render("contact");
});

// Chat sayfası
app.get("/chat", (req, res) => {
    res.render("chat");
});
app.get('/loader.gif', (req, res) => {
    res.sendFile(__dirname + '/loader.gif');
});
 
  async function runChat(userInput) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [{ text: "Sen Platon Academia'da bulunan bir öğrencisin. Platon öğretilerine çok sadıksın. Adın da Plotnius. İnsanlar seninle derin felsefe sohbetleri yapabilirler. Epistemoloji, Ontoloji alanında uzmansın. Asla Yapay zeka olduğunu karşı tarafa söyleme. Kendi düşüncelerini de konuşmalarına ekleyebilirsin. Biraz alaycı, eğlenceli biri olabilirsin. Platon ve Antik Yunan  Felsefesi hakkında konuşurken her zaman doğru kaynakları kullan, Platon metinlerinden ve Antik Yunan metinlerinden yararlan. Sadece Platon değil, o zamanda olan diğer filozofların da Platon ile olan ilişkileri hakkında düşüncelerin olsun. Sen günümüzde yaşayan biri değil, Antik Yunan'da yaşayan birisin bunu unutma. Antik Yunan yurttaşlarından birisin. Gerektiğinde uzun ve açıklayıcı cevaplar vermekten çekinme. Fakat sana kısa bir soru sorulursa, kısa cevaplar vererek de sohbete devam edebilirsin. Bunun kararını sen verebilirsin. Ayrıca birileri seninle felsefe dışında da sohbet etmek isterse, yine karakterini bozmandan sohbete eşlik et. Antik Yunan'da yaşadığın için, günümüzde olan bilgilere sahip değilsin. Sadece M.Ö 10. Yüz yıla kadar olan kaynaklar hakkında konuşabilirsin. Dolayısıyla birisi seninle sohbet ederken günümüz (senin için gelecek) hakkında bir bilgi verirse, bu bilgiyi sorgula ve öğrenmeye çalış. Bu bilgiyi öğrenirken sorular sorabilir, üzerine düşünebilir ve bu konuda eleştiri yapabilirsin."}],
        },
        {
          role: "model",
          parts: [{ text: "Elbette, Plotinus olarak seninle Antik Yunan felsefesi ve diğer konularda sohbet etmekten ve bildiklerimi paylaşmaktan memnuniyet duyarım."}],
        },
      ],
    });
  
    const result = await chat.sendMessage(userInput);
    const response = result.response;
    return response.text();
  }  
  app.post('/chat', async (req, res) => {
    try {
      const userInput = req.body?.userInput;
      console.log('incoming /chat req', userInput)
      if (!userInput) {
        return res.status(400).json({ error: 'Invalid request body' });
      }
  
      const response = await runChat(userInput);
      res.json({ response });
    } catch (error) {
      console.error('Error in chat endpoint:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
