process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const { createBot } = require('mineflayer')
const {SocksProxyAgent} = require('socks-proxy-agent')
const socks = require('socks').SocksClient
const { mcServerHost, mcServerPort, proxyHost, proxyPassword, proxyPort, proxyUsername } = require('./config.json')

const agent = new SocksProxyAgent(
	'socks5h://spbr8hsdl4:we6Pc8oHk~wo77zYNs@gate.smartproxy.com:7000'
);

const bot = createBot({
  username: 'SMCodesBOT',
  auth: "offline", // for offline mode servers, you can set this to 'offline'
  skipValidation: true,
  host: mcServerHost,
  port: mcServerPort,
  agent: agent,
  connect: (client) => {
    socks.createConnection({
      proxy: {
        host: proxyHost,
        port: proxyPort,
        type: 5,
        userId: proxyUsername,
        password: proxyPassword
      },
      command: 'connect',
      destination: {
        host: mcServerHost,
        port: mcServerPort
      }
    }, (err, info) => {
      if (err) {
        console.log(err)
        return
      }
      client.setSocket(info.socket)
      client.emit('connect')
    })
  }
})

bot.once('spawn', () => console.log('spawned'))