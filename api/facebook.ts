import { NowRequest, NowResponse } from '@now/node'
import axios from 'axios'
import format from 'date-fns/format'
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import id from 'date-fns/locale/id'

export default async function (req: NowRequest, res: NowResponse): Promise<void> {
  try {
    const { data } = await axios.get('https://coronavirus-19-api.herokuapp.com/countries/Indonesia')
    const zonedTime = utcToZonedTime(Date.now(), 'Asia/Jakarta')
    const reportDate = format(zonedTime, 'dd MMMM yyyy HH:mm', {
      locale: id
    })
    const buildText = `
[Waktu Laporan: ${reportDate}]<br>
Jumlah Kasus Hari Ini: ${data.todayCases}<br>
Jumlah Kematian Hari Ini: ${data.todayDeaths}<br>&nbsp;<br>
Jumlah Kasus Total: ${data.cases}<br>
Jumlah Kematian Total: ${data.deaths}<br>
Jumlah Kasus Pulih: ${data.recovered}<br>
Jumlah Kasus Aktif: ${data.active}<br>
`
    console.log(buildText)
    await axios.post(process.env.IFTTT_TOKEN, {
      value1: buildText
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    res.send(buildText)
  } catch (e) {
    console.log(e)
  }
}
