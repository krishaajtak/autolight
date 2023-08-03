const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');

(async () => {
   
  const browser = await puppeteer.launch({ headless: true, 
    defaultViewport: {
        width: 1200,
        height: 900
    },
                                          args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

    await  page.goto("https://thesportstak.com/", {waitUntil: 'networkidle2'});

    const {lhr} = await lighthouse("https://thesportstak.com/", {
        port: (new URL(browser.wsEndpoint())).port,
        output: 'json',
        logLevel: 'info',
        disableDeviceEmulation: true,
        defaultViewport: {
            width: 1200,
            height: 900
        },
        // '--headless',
        chromeFlags: ['--headless','--disable-mobile-emulation','--no-sandbox', '--disable-setuid-sandbox']
      });
      
      console.log(`Lighthouse scores: ${Object.values(lhr.categories).map(c => c.score).join(', ')}`);
      

//   runLighthouseForURL("https://thesportstak.com/", opts, "sportstak");


 
  // await browser.close();
})();


async function runLighthouseForURL(pageURL, opts, reportName) {

    const reportNameForFile = reportName.replace(/\s/g, '');

    let scores = {Performance: 0, Accessibility: 0, "Best Practices": 0, SEO: 0};
    let slackArray = [];

    const report = await lighthouse(pageURL, opts, config).then(results => {
        return results;
    });
    const html = reportGenerator.generateReport(report.lhr, 'html');
    const json = reportGenerator.generateReport(report.lhr, 'json');
    scores.Performance = JSON.parse(json).categories.performance.score;
    scores.Accessibility = JSON.parse(json).categories.accessibility.score;
    scores["Best Practices"] = JSON.parse(json)["categories"]["best-practices"]["score"];
    scores.SEO = JSON.parse(json).categories.seo.score;


    let baselineScores = {
        "Performance": 0.80,
        "Accessibility": 0.80,
        "Best Practices": 0.80,
        "SEO": 0.80
    };

    fs.writeFile('ReportHTML-' + reportNameForFile + '.html', html, (err) => {
        if (err) {
            console.error(err);
        }
    });

    fs.writeFile('ReportJSON-' + reportNameForFile + '.json', json, (err) => {
        if (err) {
            console.error(err);
        }
    });

    fs.writeFile('ReportScores-' + reportNameForFile + '.txt', JSON.stringify(scores, null, 2), (err) => {
        if (err) {
            console.error(err);
        }
    });

    let BreakException = {};
    let SlackHeadline = "Default Headline";

    try {
        Object.keys(baselineScores).forEach(key => {
            let baselineValue = baselineScores[key];
            console.log(scores);

            if (scores[key] != null && baselineValue > scores[key]) {
                Object.keys(baselineScores).forEach(key => {
                    const scorePercent=scores[key]*100;
                    slackArray.push({title: `${key}`, value: `${scorePercent}%`, short: true});
                });
                console.log(slackArray);
                console.log(`${app_name}: ` + key + " score " + scores[key]*100 + "% for " + reportName + " is less than the defined baseline of " + baselineValue*100 + "%");
                SlackHeadline = `*${app_name}:* _` + key + `_ score for <${pageURL}|` + reportName + "> below " + baselineValue*100 + "%";
                throw BreakException;
            }
        });
    } catch (e) {
        if (e !== BreakException) throw e;
    }

    
}