const axios = require('axios');
const express = require('express');//Set up the express module
const app = express();
const router = express.Router();
var moment = require('moment');
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/report/generator/report-generator');
// 1//0gIRST_01QokJCgYIARAAGBASNwF-L9IrsRhW7B2AzuOdTGBrJOdmO_AZUPyVFMJKaR_gUmS4jFo8q4fTC5K54SpRMBjuSpjc76s

// 1//0gDeX04WCvax9CgYIARAAGBASNwF-L9IrRKT2A8cgskYyZSr7bq2SOJV9l2iHRJKR-CP0LY65I0wJ-IVlgxYvSd3DVodT1tBEbvw
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

   const browserUrl = "https://m.thesportstak.com/cricket-news/pat-cummins-australia-captain-undisplaced-fracture-left-radius-ruled-out-for-6-weeks-chief-selector-george-bailey-revealshttps://m.thesportstak.com/cricket-news/pat-cummins-australia-captain-undisplaced-fracture-left-radius-ruled-out-for-6-weeks-chief-selector-george-bailey-reveals"
   const width = 375
   const height = 667
   let now = new Date();

     const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: width,
        height: height
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    await page.goto(browserUrl, { waitUntil: 'networkidle2' });

    const { lhr } = await lighthouse(browserUrl, {
      port: (new URL(browser.wsEndpoint())).port,
      output: 'json',
      logLevel: 'info',
      disableDeviceEmulation: true,
      defaultViewport: {
        width: width,
        height: height
      },
      // '--headless',
      chromeFlags: ['--headless', '--disable-mobile-emulation', '--no-sandbox', '--disable-setuid-sandbox']
    });

    console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
    // const lighthouse_results = generateReport(lhr);

    const html = ReportGenerator.generateReport(lhr, 'html');

    fs.writeFileSync(path.join(__dirname, 'public', 'report.html'), html);

   

    await browser.close();

    var reportCard = {
      "type":"message",
      "attachments":[
         {
            "contentType":"application/vnd.microsoft.card.adaptive",
            "contentUrl":null,
            "content":{
             "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
       "type": "AdaptiveCard",
       "version": "1.6",
       "actions": [
        {
            "type": "Action.OpenUrl",
            "title": "View",
          "url": "https://autolighttak.web.app/report.html",
            "role": "Button"
        }
    ],
       "body": [
           {
               "type": "Container",
               "items": [
                   {
                       "type": "TextBlock",
                       "text": "Lighthouse report",
                       "size": "Medium",
                       "wrap": true,
                       "style": "heading"
                   },
                   {
                       "type": "TextBlock",
                       "text": `${browserUrl} on device having size ${width} x ${height}`,
                       "isSubtle": true,
                       "spacing": "None",
                       "wrap": true
                   },
                   {
                       "type": "TextBlock",
                       "text": `${now}`,
                       "wrap": true
                   }
               ]
           },
           {
               "type": "Container",
               "spacing": "None",
               "items": [
                   {
                       "type": "ColumnSet",
                       "columns": [
                           {
                               "type": "Column",
                               "width": "stretch",
                               "items": [
                                   {
                                       "type": "TextBlock",
                                       "text": `${lhr.categories.performance.score * 100}%`,
                                       "size": "ExtraLarge",
                                       "wrap": true
                                   },
                                   {
                                       "type": "TextBlock",
                                       "text": "Performance",
                                       "color": 'attention',
                                       "spacing": "None",
                                       "wrap": true
                                   }
                               ]
                           },
                           {
                               "type": "Column",
                               "width": "auto",
                               "items": [
                                   {
                                       "type": "FactSet",
                                       "facts": [
                                           {
                                               "title": "Accessibility",
                                               "value": `${lhr.categories.accessibility.score  * 100 }%`
                                           },
                                           {
                                               "title": "Best Practices",
                                               "value": `${lhr.categories['best-practices'].score  * 100}%`
                                           },
                                           {
                                               "title": "SEO",
                                               "value": `${lhr.categories.seo.score  * 100}%`
                                           }
                                       ]
                                   }
                               ]
                           }
                       ]
                   }
               ]
           }
       ]
            }
         }
      ]
   }
   
   
   

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



      axios.post("https://indiatodaygroup.webhook.office.com/webhookb2/f9d0d11c-b35d-4c63-abcf-86021746b841@c6429039-bbd0-4d9b-8542-13cc4acc2d0c/IncomingWebhook/fd860f7994d74786a92a3b281e327446/bb104a27-6b22-43a7-98bd-46619c2a8f89", reportCard).then(res => {
        console.log(`statusCode: ${res.status}`)
        console.log(res)
      })
        .catch(error => {
          console.error(error)
        })



}



comparision();

