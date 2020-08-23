

class ResizeableBuffer{
  constructor(size=100){
    this.size = size
    this.length = 0
    this.buf = Buffer.alloc(size)
  }
  prepend(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    const buf = this.clone()
    this.buf[0] = val
    buf.copy(this.buf,1, 0, length)
  }
  append(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    this.buf[length] = val
  }
  clone(){
    return Buffer.from(this.buf.slice(0, this.length))
  }
  resize(){
    const length = this.length
    this.size = this.size * 2
    const buf = Buffer.alloc(this.size)
    this.buf.copy(buf,0, 0, length)
    this.buf = buf
  }
  toString(){
    return this.buf.slice(0, this.length).toString()
  }
  toJSON(){
    return this.toString()
  }
  reset(){
    this.length = 0
  }
}

module.exports = ResizeableBuffer
