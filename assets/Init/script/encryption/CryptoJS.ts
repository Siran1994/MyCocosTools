//@ts-ignore
const cryptoJS = require( 'crypto-js' );  //引用AES源码js

const key = cryptoJS.enc.Utf8.parse( "lelelelelelelele" ); //十六位十六进制数作为秘钥
const iv = cryptoJS.enc.Utf8.parse( 'ABCDEF1234123412' ); //十六位十六进制数作为秘钥偏移量

export default class CryptoJS
{
  static encode ( message: string )
  {
    let srcs = cryptoJS.enc.Utf8.parse( message );
    let encrypted = cryptoJS.AES.encrypt( srcs, key, { iv: iv, mode: cryptoJS.mode.CBC, padding: cryptoJS.pad.Pkcs7 } );
    return encrypted.ciphertext.toString().toUpperCase();
  }


  static decode ( encrypt: string )
  {
    let encryptedHexStr = cryptoJS.enc.Hex.parse( encrypt );
    let srcs = cryptoJS.enc.Base64.stringify( encryptedHexStr );
    let decrypt = cryptoJS.AES.decrypt( srcs, key, { iv: iv, mode: cryptoJS.mode.CBC, padding: cryptoJS.pad.Pkcs7 } );
    let decryptedStr = decrypt.toString( cryptoJS.enc.Utf8 );
    return decryptedStr.toString();
  }
}
