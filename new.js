const axios = require('axios');
const express = require('express');//Set up the express module
const app = express();
const router = express.Router();
var moment = require('moment');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/report/generator/report-generator');
const fs = require('fs');


const path = require('path')


// var mainDate = moment(new Date()).format("YYYY-MM-DD");
var mainDate = moment(new Date("Tue Aug 24 2022 09:13:40 GMT+0530 (IST)")).format("YYYY-MM-DD");


function comparision() {
  var endDate = moment(new Date()).format("YYYY-MM-DD");

  var startDate = mainDate;

  var remainingDate = moment(endDate).diff(startDate, 'days');

  performPupeeter();

}


async function performPupeeter() {

   console.log('I am here')

     const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 375,
        height: 667
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto("https://m.thesportstak.com/", { waitUntil: 'networkidle2' });

    const { lhr } = await lighthouse("https://m.thesportstak.com/", {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      logLevel: 'info',
      disableDeviceEmulation: true,
      defaultViewport: {
        width: 375,
        height: 667
      },
      // '--headless',
      chromeFlags: ['--headless', '--disable-mobile-emulation', '--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
    // const lighthouse_results = generateReport(lhr);

    const html = ReportGenerator.generateReport(lhr, 'html');

    // fs.writeFile('report.html', html, (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });

    fs.writeFileSync(path.join(__dirname, 'public', 'report.html'), html);

    await browser.close();

    var newnwCard = {
        "type": "message",
        "attachments": [
          {
            "contentType": "application/vnd.microsoft.card.adaptive",
            "contentUrl": null,
            "content": {
              "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
              "type": "AdaptiveCard",
              "version": "1.2",
              "body": [
                {
                  "type": "TextBlock",
                  "size": "Medium",
                  "weight": "Bolder",
                  "text": "Author:" + "KRISH BHANUSHALI"
                },
                {
                  "type": "ColumnSet",
                  "columns": [
                    {
                      "type": "Column",
                      "items": [
                        {
                          "type": "Image",
                          "style": "Person",
                          "url": "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGxvZ298ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
                          "size": "Medium"
                        }
                      ],
                      "width": "auto"
                    },
                    {
                      "type": "Column",
                      "items": [
                        {
                          "type": "TextBlock",
                          "weight": "Bolder",
                          "text": "",
                          "wrap": true
                        },
                        {
                          "type": "TextBlock",
                          "spacing": "None",
                          "text": "LIGHT HOUSE REPORT",
                          "isSubtle": true,
                          "wrap": true
                        }
                      ],
                      "width": "stretch"
                    }
                  ]
                },
                {
                  "type": "TextBlock",
                  "text": `Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`,
                  "wrap": true
                },
                // {
                //   "type": "Image",
                //   "url": response.data.articles[0].urlToImage
                // }
              ],
            //   "actions": [
            //     {
            //       "type": "Action.OpenUrl",
            //       "title": "View",
            //       "url": response.data.articles[0].url
            //     }
            //   ],
            }
          }
        ]
      }



      axios.post("https://indiatodaygroup.webhook.office.com/webhookb2/ef3ceb52-ff92-4f1b-a563-01ef9363f0a4@c6429039-bbd0-4d9b-8542-13cc4acc2d0c/IncomingWebhook/9ac3ba6d1c6e4ead982c91e954ccfb7b/dad1e98a-782b-49a3-a4d1-3a98aadf47cc", newnwCard).then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
      })
        .catch(error => {
          console.error(error)
        })



}



router.get('/', function(req, res) {
    comparision()
  res.sendFile(path.join(__dirname, '/index.html'));
});



app.use('/', router);





let server = app.listen(3000, function() {
  console.log("App server is running on port 3000");
  console.log("to end press Ctrl + C");
});



