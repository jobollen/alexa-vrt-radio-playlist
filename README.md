# alexa-vrt-radio-playlist

## 1. Info
During a Hackathon on the VRT (Flemish Radio and Television Broadcasting Organization)

We created an Amazon Alexa nodejs Skill.

The purpose was to create a skill that returns the CURRENT, PREVIOUS, NEXT, LATEST song, artist and composer
of a Radio station.

```bash
Alexa ask radioplayer what is the current song on studio brussel.
Alexa ask radioplayer what is the previous artist on studio brussel.
Alexa ask radioplayer what is the latest composer on studio brussel.
```

1. We started the development with the following resources.
  * [Alexa Integrate Skills with Alexa Lists Sample Project](#MyStartResource1)
  * [Build An Alexa Fact Skill](#MyStartResource2)
  * [httpsGet](#MyStartResource3)
2. Created an Alexa Amazon Skill (The name of the skill is "VRT Hackathon GIJOE")
3. Created an AWS nodejs Lambda (To fetch the VRT service)
4. Created a local development environment.


## 2. Install
### 2.1. On local machine
#### 2.1.1. Mac OS X
1. Download de repo.
2. Run following commands in the repo
```bash
cd src
npm install alexa-sdk --save
```
```bash
cd test
npm install aws-sdk --save
```

### 2.1.2. On console.aws.amazon.com
@todo
1. Create account/Login.

### 2.1.3. On developer.amazon.com
@todo
1. Create account/Login.



## 3. Try Skill
### 3.1. Echosim
1. Create a Alexa Amazon Skill with this nodejs file OR ask me to send you an invite to test the "VRT Hackathon GIJOE"-skill.
2. Login developer account of Amazon.
3. Try the following commands.
```bash
Alexa ask GIJOE what is the current song on studio brussels.
Alexa ask GIJOE what is the current song on radio1.
Alexa ask GIJOE what is the current song on radio2.
Alexa ask GIJOE what is the current song on klara.
Alexa ask GIJOE what is the current song on mnm.
```

###  3.2. Local
The RequestCurrentSong.json file has test-data that request info about the current song of the "MNM"-Radio Station.

1. Run following command in root of the repo.
```bash
node test/main.js
```



## 4. Resources
The links below will help you get started building skills for Alexa.
### 4.1. Github
* Alexa
  * [Alexa cookbook](https://github.com/alexa/alexa-cookbook)
  * <a name="MyStartResource1"></a>[Alexa Integrate Skills with Alexa Lists Sample Project](https://github.com/alexa/alexa-cookbook/tree/master/context)
  * <a name="MyStartResource2"></a>[Build An Alexa Fact Skill](https://github.com/alexa/skill-sample-nodejs-fact)
  * <a name="MyStartResource3"></a>[httpsGet](https://github.com/alexa/alexa-cookbook/tree/master/external-calls/httpsGet)
  * [Alexa skills-kit-sdk-for-nodejs](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs)
* Others
  * [Build your First Alexa Skill](https://github.com/Donohue/alexa)
### 4.2. Amazon
* Blog
  * [Alexa Technical Tutorial: Debugging AWS Lambda Code Locally](https://developer.amazon.com/blogs/post/Tx24Z2QZP5RRTG1/new-alexa-technical-tutorial-debugging-aws-lambda-code-locally)
### 4.3. Echosim
* A echo device simulatior. See [Resources](https://echosim.io/resources)