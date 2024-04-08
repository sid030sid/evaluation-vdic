import { create } from '@web3-storage/w3up-client'
 
const client = await create()

const myAccount = await client.login('zaphod@beeblebrox.galaxy')