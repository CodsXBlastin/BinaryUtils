/**
 *    ______            _                 ___  ________ 
 *    | ___ \          | |                |  \/  /  __ \
 *    | |_/ /__ _ _ __ | |_ ___  _ __ ___ | .  . | /  \/
 *    |    // _` | '_ \| __/ _ \| '__/ __|| |\/| | |    
 *    | |\ \ (_| | |_) | || (_) | |  \__ \| |  | | \__/\
 *    \_| \_\__,_| .__/ \__\___/|_|  |___/\_|  |_/\____/
 *               | |                                    
 *               |_|      
 * 
 * Misuse or redistribution of this code is strictly prohibted.
 * This applies to, and is not limited to self projects and open source projects.
 * If you wish to use this projects code, please contact us.
 * © RaptorsMC 2020
 * 
 * @author RaptorsMC
 * @copyright https://github.com/RaptorsMC
 * @license RaptorsMC/CustomLicense
 */
import Buffer from 'https://deno.land/std/node/buffer.ts';
import { readUIntBE, readUIntLE } from './buffer/readUInt.ts';
import { readIntBE, readIntLE } from './buffer/readInt.ts';
import { writeUIntBE, writeUIntLE } from './buffer/writeUInt.ts';
import { writeIntBE, writeIntLE } from './buffer/writeInt.ts';

class BinaryStream {
    private _buffer: Buffer;
    private _offset: number;

  constructor(buffer: Buffer = Buffer.alloc(0), offset: number = 0) {
        this._buffer = buffer;
        this._offset = offset;
    }

    /**
     * Appends a buffer to the binary one.
     */
    public append(buffer: Buffer): void {
        this._buffer = Buffer.concat([this._buffer, buffer])
        this.addOffset(Buffer.byteLength(buffer))
    }

    /**
     *  Reads a buffer slice with the given length
     * from the actual offset to the offset + len
     */
  public read(len: number): Buffer {
        return this._buffer.slice(this._offset, this.addOffset(len, true));
    }

    /**
     * Reads an unsigned byte (0 - 255)
     */
    public readByte(): number {
        return this._buffer.readUInt8(this.addOffset(1));
    }

    /**
     * Reads a signed byte (-128 - 127)
     */
    public readSignedByte(): number {
        return this._buffer.readInt8(this.addOffset(1));
    }

    /**
     * Writes an unsigned / signed byte 
     */
    public writeByte(v: number): void {
        this.append(Buffer.from([v & 0xff]));
    }

    /**
     * Reads a boolean byte
     */
    public readBool(): boolean {
        return this.readByte() !== 0;
    }

    /**
     * Writes a boolean byte
     */
    public writeBool(v: boolean): void {
        this.writeByte(v ? 1 : 0);
    }

    /**
     * Reads a 16 bit unsigned big endian number
     */
    public readShort(): number {
        return this._buffer.readUInt16BE(this.addOffset(2));
    }

    /**
     * Reads a 16 bit signed big endian number
     */
    public readSignedShort(): number {
        return this._buffer.readInt16BE(this.addOffset(2));
    }

    /**
     * Writes a 16 bit signed / unsigned big endian number
     */
    public writeShort(v: number): void {
        this.writeByte((v >> 8) & 0xff);
        this.writeByte(v & 0xff);
    }

    /**
     * Reads an unsigned 16 bit little endian number
     */
    public readLShort(): number {
        return this._buffer.readUInt16LE(this.addOffset(2));
    }

    /**
     * Reads a signed 16 bit little endian number
     */
    public readSignedLShort(): number {
        return this._buffer.readInt16LE(this.addOffset(2));
    }

    /**
     * Writes a 16 bit signed / unsigned little endian number
     */
    public writeLShort(v: number): void {
        this.writeByte(v & 0xff);
        this.writeByte((v >> 8) & 0xff);
    }

    /**
     * Reads a 3 byte unsigned big endian number
     */
    public readTriad(): bigint {
        // we need to replicate readUIntLE
        return readUIntBE(this._buffer, this.addOffset(3), 3);
    }

    /**
     * Reads a 3 byte unsigned little endian number
     */
    public readLTriad(): number {
        return readUIntLE(this._buffer, this.addOffset(3), 3);
    }

    /**
     * Writes a 3 byte unsigned big endian number
     */
    public writeTriad(v: number): void {
        let buffer = Buffer.alloc(3);
        writeUIntBE(buffer, v, 0, 3);
        this.append(buffer);
    }


    /**
     * Reads a 3 byte unsigned little endian number
     */
    public writeLTriad(v: number) {
        let buf = Buffer.alloc(3);
        writeUIntLE(buf, v, 0, 3);
        this.append(buf);
    }

    /**
     * Reads a 4 byte signed integer
     */
    public readInt(): number {
        return this._buffer.readInt32BE(this.addOffset(4));
    }

    /**
     * Writes a 4 byte signed integer
     */
    public writeInt(v: number): void {
        let buffer = Buffer.alloc(4);
        buffer.writeInt32BE(v);
        this.append(buffer);
    }

    /**
     * Reads a 4 byte signed little endian integer
     */
    public readLInt(): number {
        return this._buffer.readInt32LE(this.addOffset(4));
    }

    /**
     * Writes a 32 bit signed little endian integer
     */
    public writeLInt(v: number): void {
        let buffer = Buffer.alloc(4);
        buffer.writeInt32LE(v);
        this.append(buffer);
    }

    /**
     * Reads a 4 byte floating-point number
     */
    public readFloat(): number {
        return this._buffer.readFloatBE(this.addOffset(4));
    }

    /**
     * Reads a 4 byte floating-point number, rounded to the specified precision
     */
    public readRoundedFloat(precision: number): string {
        return Math.fround(this.readFloat()).toPrecision(precision);
    }

    /**
     * Writes a 4 byte floating-point number
     */
    public writeFloat(v: number): void {
        let buffer = Buffer.alloc(4);
        buffer.writeFloatBE(v);
        this.append(buffer);
    }

    /**
     * Reads a 4 byte little endian floating-point number
     */
    public readLFloat(): number {
        return this._buffer.readFloatLE(this.addOffset(4));
    }

    /**
     * Reads a 4 byte little endian floating-point number, rounded to the specified precision
     */
    public readRoundedLFloat(precision: number): string {
        return Math.fround(this.readLFloat()).toPrecision(precision);
    }

    /**
     * Writes a 4 byte little endian floating-point number
     */
    public writeLFloat(v: number): void {
        let buffer = Buffer.alloc(4);
        buffer.writeFloatLE(v);
        this.append(buffer);
    }

    /**
     * Reads an 8 byte floating-point number
     */
    public readDouble(): number {
        return this._buffer.readDoubleBE(this.addOffset(8));
    }

    /**
     * Writes an 8 byte floating-point number
     */
    public writeDouble(v: number): void {
        let buffer = Buffer.alloc(8);
        buffer.writeDoubleBE(v);
        this.append(buffer);
    }

    /**
     * Reads an 8 byte little endian floating-point number
     */
    public readLDouble(): number {
        return this._buffer.readDoubleLE(this.addOffset(8));
    }

    /**
     *  Writes an 8 byte little endian floating-poinr number
     */
    public writeLDouble(v: number): void {
        let buffer = Buffer.alloc(8);
        buffer.writeDoubleLE(v);
        this.append(buffer);
    }

    /**
     * Reads an 8 byte integer
     */
    public readLong(): bigint {
        return this._buffer.readBigInt64BE(this.addOffset(8));
    }

    /**
     * Writes an 8 byte integer
     */
    public writeLong(v: bigint): void {
        let buffer = Buffer.alloc(8);
        buffer.writeBigInt64BE(v);
        this.append(buffer);
    }

    /**
     * Reads an 8 byte little endian integer
     */
    public readLLong(): bigint {
        return this._buffer.readBigInt64LE(this.addOffset(8));
    }

    /**
     * Writes an 8 byte little endian integer
     */
    public writeLLong(v: bigint): void {
        let buffer = Buffer.alloc(8);
        buffer.writeBigInt64LE(v);
        this.append(buffer);
    }

    /**
     * Reads a 32 bit zigzag-encoded integer
     */
    public readVarInt() {
        let raw = this.readUnsignedVarInt() ;
        let temp = (((raw << 63) >> 63) ^ raw) >> 1;
        return temp ^ (raw & (1 << 63));
    }

    /**
     * Reads a 32 bit unsigned integer
     */
    public readUnsignedVarInt() {
        let value = 0;
        for (let i = 0; i <= 28; i += 7) {
            if (typeof this._buffer[this._offset] === 'undefined') {
                throw new Error('No bytes left in buffer');
            }
            let b = this.readByte();
            value |= ((b & 0x7f) << i);

            if ((b & 0x80) === 0) {
                return value;
            }
        }

        throw new Error('VarInt did not terminate after 5 bytes!');
    }

    /**
     * Writes a 32 bit integer as a zig-zag encoded integer
     */
    public writeVarInt(v: number): void {
        v = (v << 32 >> 32);
        return this.writeUnsignedVarInt((v << 1) ^ (v >> 31));
    }

    /**
     * Writes a 32 bit unsigned integer
     */
    public writeUnsignedVarInt(v: number): void {
        let stream = new BinaryStream();
        v &= 0xffffffff;

        for (let i = 0; i < 5; i++) {
            if ((v >> 7) !== 0) {
                stream.writeByte(v | 0x80);
            } else {
                stream.writeByte(v & 0x7f);
                this.append(stream.buffer);
                return;
            }
            v >>= 7;
        }

        this.append(stream.buffer);
    }

    /**
     * Reads a 64 bit zigzag-encoded long
     */
    public readVarLong(): number {
        let raw = this.readUnsignedVarLong();
        let tmp = (((raw << 63) >> 63) ^ raw) >> 1;
        return tmp ^ (raw & (1 << 63));
    }

    /**
     * Reads a 64 bit unsigned long
     */
    public readUnsignedVarLong(): number {
        let value = 0;
        for (let i = 0; i <= 63; i += 7) {
            if (typeof this._buffer[this._offset] === 'undefined') {
                throw new Error('No bytes left in buffer');
            }
            let b = this.readByte();
            value |= ((b & 0x7f) << i);

            if ((b & 0x80) === 0) {
                return value;
            }
        }
        
        throw new Error('VarInt did not terminate after 10 bytes!');
    }

    /**
     * Writes a 64 bit integer as zigzag-encoded long
     */
    public writeVarLong(v: number): void {
        return this.writeUnsignedVarLong((v << 1) ^ (v >> 63));
    }

    /**
     * Writes a 64 bit unsigned integer long
     */
    public writeUnsignedVarLong(v: number) {
        for (let i = 0; i < 10; i++) {
            if ((v >> 7) !== 0) {
                this.writeByte(v | 0x80);
            } else {
                this.writeByte(v & 0x7f);
                break;
            }
            v >>= 7;
        }
    }

    /**
     * Increase offset value by the given bytes.
     */
    public addOffset(v: number, r = false): number {
        if (r) return this._offset += v;
        return (this._offset += v) - v;
    }

    /**
     * Returns whether the offset has reached the end of the buffer.
     */
    public feof() {
        return typeof this._buffer[this._offset] === 'undefined';
    }

    /**
     * Returns the remaining o
     */
    public readRemaining(): Buffer {
        let buffer = this._buffer.slice(this._offset);
        this._offset = this._buffer.length;
        return buffer;
    }

    /**
     * Resets the offset to 0
     */
    public reset(): void {
        this._buffer = Buffer.alloc(0);
        this._offset = 0;
    }

    /**
     * Returns the offset of the stream
     */
    get offset(): number {
        return this._offset;
    }

    /**
     * Sets the offset
     */
    set offset(offset) {
        this._offset = offset;
    }

    /**
     * Gets the buffer from the stream
     */
    get buffer(): Buffer {
        return this._buffer;
    }

    /**
     * Sets the buffer of the stream
     */
    set buffer(buffer: Buffer) {
        this._buffer = buffer;
    }
}
export default BinaryStream;
