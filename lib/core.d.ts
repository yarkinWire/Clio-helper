/**
 * @wireio/core v0.0.5-6
 * https://github.com/Wire-Network/sdk-core
 *
 * @license
 * Wire Network<br />
 * Copyright (c) 2024 WIRE NETWORK, INC. and its contributors. All Rights Reserved.<br />
 * This software is owned and created by Wire Network, but it builds upon:
 * 
 * @wharfkit/antelope<br />
 * Copyright (c) 2023 FFF00 Agents AB & Greymass Inc. All Rights Reserved.
 * 
 * ---
 * 
 * # Functional Source License, Version 1.1, Apache 2.0 Future License
 * 
 * ## Abbreviation
 * 
 * FSL-1.1-Apache-2.0
 * 
 * ## Notice
 * 
 * Copyright 2024 WIRE NETWORK, INC.
 * 
 * ## Terms and Conditions
 * 
 * ### Licensor ("We")
 * 
 * The party offering the Software under these Terms and Conditions.
 * 
 * ### The Software
 * 
 * The "Software" is each version of the software that we make available under
 * these Terms and Conditions, as indicated by our inclusion of these Terms and
 * Conditions with the Software.
 * 
 * ### License Grant
 * 
 * Subject to your compliance with this License Grant and the Patents,
 * Redistribution and Trademark clauses below, we hereby grant you the right to
 * use, copy, modify, create derivative works, publicly perform, publicly display
 * and redistribute the Software for any Permitted Purpose identified below.
 * 
 * ### Permitted Purpose
 * 
 * A Permitted Purpose is any purpose other than a Competing Use. A Competing Use
 * means making the Software available to others in a commercial product or
 * service that:
 * 
 * 1. substitutes for the Software;
 * 
 * 2. substitutes for any other product or service we offer using the Software
 *    that exists as of the date we make the Software available; or
 * 
 * 3. offers the same or substantially similar functionality as the Software.
 * 
 * Permitted Purposes specifically include using the Software:
 * 
 * 1. for your internal use and access;
 * 
 * 2. for non-commercial education;
 * 
 * 3. for non-commercial research; and
 * 
 * 4. in connection with professional services that you provide to a licensee
 *    using the Software in accordance with these Terms and Conditions.
 * 
 * ### Patents
 * 
 * To the extent your use for a Permitted Purpose would necessarily infringe our
 * patents, the license grant above includes a license under our patents. If you
 * make a claim against any party that the Software infringes or contributes to
 * the infringement of any patent, then your patent license to the Software ends
 * immediately.
 * 
 * ### Redistribution
 * 
 * The Terms and Conditions apply to all copies, modifications and derivatives of
 * the Software.
 * 
 * If you redistribute any copies, modifications or derivatives of the Software,
 * you must include a copy of or a link to these Terms and Conditions and not
 * remove any copyright notices provided in or with the Software.
 * 
 * ### Disclaimer
 * 
 * THE SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF FITNESS FOR A PARTICULAR
 * PURPOSE, MERCHANTABILITY, TITLE OR NON-INFRINGEMENT.
 * 
 * IN NO EVENT WILL WE HAVE ANY LIABILITY TO YOU ARISING OUT OF OR RELATED TO THE
 * SOFTWARE, INCLUDING INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES,
 * EVEN IF WE HAVE BEEN INFORMED OF THEIR POSSIBILITY IN ADVANCE.
 * 
 * ### Trademarks
 * 
 * Except for displaying the License Details and identifying us as the origin of
 * the Software, you have no right under these Terms and Conditions to use our
 * trademarks, trade names, service marks or product names.
 * 
 * ## Grant of Future License
 * 
 * We hereby irrevocably grant you an additional license to use the Software under
 * the Apache License, Version 2.0 that is effective on the second anniversary of
 * the date we make the Software available. On or after that date, you may use the
 * Software under the Apache License, Version 2.0, in which case the following
 * will apply:
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License.
 * 
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software distributed
 * under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
import BN from 'bn.js';
import { ec } from 'elliptic';

interface BuiltinTypes {
    string: string;
    'string?'?: string;
    'string[]': string[];
    'string[]?'?: string[];
    bool: boolean;
    'bool?'?: boolean;
    'bool[]': boolean[];
    'bool[]?'?: boolean[];
    asset: Asset;
    'asset?'?: Asset;
    'asset[]': Asset[];
    'asset[]?'?: Asset[];
    extended_asset: ExtendedAsset;
    'extended_asset?'?: ExtendedAsset;
    'extended_asset[]': ExtendedAsset[];
    'extended_asset[]?'?: ExtendedAsset[];
    bytes: Bytes;
    'bytes?'?: Bytes;
    'bytes[]': Bytes[];
    'bytes[]?'?: Bytes[];
    checksum160: Checksum160;
    'checksum160?'?: Checksum160;
    'checksum160[]': Checksum160[];
    'checksum160[]?'?: Checksum160[];
    checksum256: Checksum256;
    'checksum256?'?: Checksum256;
    'checksum256[]': Checksum256[];
    'checksum256[]?'?: Checksum256[];
    checksum512: Checksum512;
    'checksum512?'?: Checksum512;
    'checksum512[]': Checksum512[];
    'checksum512[]?'?: Checksum512[];
    name: Name;
    'name?'?: Name;
    'name[]': Name[];
    'name[]?'?: Name[];
    publickey: PublicKey;
    'publickey?'?: PublicKey;
    'publickey[]': PublicKey[];
    'publickey[]?'?: PublicKey[];
    signature: Signature;
    'signature?'?: Signature;
    'signature[]': Signature[];
    'signature[]?'?: Signature[];
    symbol: Asset.Symbol;
    'symbol?'?: Asset.Symbol;
    'symbol[]': Asset.Symbol[];
    'symbol[]?'?: Asset.Symbol[];
    symbol_code: Asset.SymbolCode;
    'symbol_code?'?: Asset.SymbolCode;
    'symbol_code[]': Asset.SymbolCode[];
    'symbol_code[]?'?: Asset.SymbolCode[];
    time_point: TimePoint;
    'time_point?'?: TimePoint;
    'time_point[]': TimePoint[];
    'time_point[]?'?: TimePoint[];
    time_point_sec: TimePointSec;
    'time_point_sec?'?: TimePointSec;
    'time_point_sec[]': TimePointSec[];
    'time_point_sec[]?'?: TimePointSec[];
    block_timestamp_type: BlockTimestamp;
    'block_timestamp_type?'?: BlockTimestamp;
    'block_timestamp_type[]': BlockTimestamp[];
    'block_timestamp_type[]?'?: BlockTimestamp[];
    int8: Int8;
    'int8?'?: Int8;
    'int8[]': Int8[];
    'int8[]?'?: Int8[];
    int16: Int16;
    'int16?'?: Int16;
    'int16[]': Int16[];
    'int16[]?'?: Int16[];
    int32: Int32;
    'int32?'?: Int32;
    'int32[]': Int32[];
    'int32[]?'?: Int32[];
    int64: Int64;
    'int64?'?: Int64;
    'int64[]': Int64[];
    'int64[]?'?: Int64[];
    int128: Int128;
    'int128?'?: Int128;
    'int128[]': Int128[];
    'int128[]?'?: Int128[];
    uint8: UInt8;
    'uint8?'?: UInt8;
    'uint8[]': UInt8[];
    'uint8[]?'?: UInt8[];
    uint16: UInt16;
    'uint16?'?: UInt16;
    'uint16[]': UInt16[];
    'uint16[]?'?: UInt16[];
    uint32: UInt32;
    'uint32?'?: UInt32;
    'uint32[]': UInt32[];
    'uint32[]?'?: UInt32[];
    uint64: UInt64;
    'uint64?'?: UInt64;
    'uint64[]': UInt64[];
    'uint64[]?'?: UInt64[];
    uint128: UInt128;
    'uint128?'?: UInt128;
    'uint128[]': UInt128[];
    'uint128[]?'?: UInt128[];
    varint: VarInt;
    'varint?'?: VarInt;
    'varint[]': VarInt[];
    'varint[]?'?: VarInt[];
    varuint: VarUInt;
    'varuint?'?: VarUInt;
    'varuint[]': VarUInt[];
    'varuint[]?'?: VarUInt[];
    float32: Float32;
    'float32?'?: Float32;
    'float32[]': Float32[];
    'float32[]?'?: Float32[];
    float64: Float64;
    'float64?'?: Float64;
    'float64[]': Float64[];
    'float64[]?'?: Float64[];
    float128: Float128;
    'float128?'?: Float128;
    'float128[]': Float128[];
    'float128[]?'?: Float128[];
}

/**
 * Antelope/EOSIO ABI Decoder
 */

interface DecodeArgsBase {
    abi?: ABIDef;
    data?: BytesType | ABIDecoder;
    json?: string;
    object?: any;
    customTypes?: ABISerializableConstructor[];
    /** Optional encoder metadata. */
    metadata?: Record<string, any>;
    /**
     * Binary extension handling, if set to true missing extensions will be initialized,
     * otherwise they will be set to null. Defaults to false.
     */
    strictExtensions?: boolean;
    /**
     * Set to ignore invalid UTF-8, otherwise an error will be thrown (default).
     */
    ignoreInvalidUTF8?: boolean;
}
interface TypedDecodeArgs<T extends ABISerializableType> extends DecodeArgsBase {
    type: T;
}
interface BuiltinDecodeArgs<T extends keyof BuiltinTypes> extends DecodeArgsBase {
    type: T;
}
interface UntypedDecodeArgs extends DecodeArgsBase {
    type: ABISerializableType;
}
declare function abiDecode<T extends keyof BuiltinTypes>(args: BuiltinDecodeArgs<T>): BuiltinTypes[T];
declare function abiDecode<T extends ABISerializableConstructor>(args: TypedDecodeArgs<T>): InstanceType<T>;
declare function abiDecode(args: UntypedDecodeArgs): ABISerializable;
declare class ABIDecoder {
    private array;
    static __className: string;
    private pos;
    private data;
    private textDecoder;
    /** User declared metadata, can be used to pass info to instances when decoding.  */
    metadata: Record<string, any>;
    constructor(array: Uint8Array, textDecoder?: TextDecoder);
    canRead(bytes?: number): boolean;
    private ensure;
    setPosition(pos: number): void;
    getPosition(): number;
    advance(bytes: number): void;
    /** Read one byte. */
    readByte(): number;
    /** Read floating point as JavaScript number, 32 or 64 bits. */
    readFloat(byteWidth: number): number;
    readVaruint32(): number;
    readVarint32(): number;
    readArray(length: number): Uint8Array;
    readString(): string;
}

/**
 * Antelope/EOSIO ABI Encoder
 */

interface EncodeArgsBase {
    /**
     * ABI definition to use when encoding.
     */
    abi?: ABIDef;
    /**
     * Additional types to use when encoding, can be used to pass type constructors
     * that should be used when encountering a custom type.
     */
    customTypes?: ABISerializableConstructor[];
    /**
     * Can be passed to use a custom ABIEncoder instance.
     */
    encoder?: ABIEncoder;
    /**
     * Optional metadata to pass to the encoder.
     */
    metadata?: Record<string, any>;
}
interface EncodeArgsUntyped extends EncodeArgsBase {
    /**
     * Object to encode, either a object conforming to `ABISerializable`
     * or a JavaScript object, when the latter is used an the `type`
     * argument must also be set.
     */
    object: any;
    /**
     * Type to use when encoding the given object, either a type constructor
     * or a string name of a builtin type or a custom type in the given `abi`.
     */
    type: ABISerializableType;
}
interface EncodeArgsSerializable extends EncodeArgsBase {
    /**
     * Object conforming to `ABISerializable` to be encoded.
     */
    object: ABISerializable;
    /**
     * Optional type-override for given serializable object.
     */
    type?: ABISerializableType;
}
type EncodeArgs = EncodeArgsSerializable | EncodeArgsUntyped;
declare function abiEncode(args: EncodeArgs): Bytes;
declare class ABIEncoder {
    private pageSize;
    static __className: string;
    private pos;
    private data;
    private array;
    private textEncoder;
    /** User declared metadata, can be used to pass info to instances when encoding.  */
    metadata: Record<string, any>;
    constructor(pageSize?: number);
    private ensure;
    /** Write a single byte. */
    writeByte(byte: number): void;
    /** Write an array of bytes. */
    writeArray(bytes: ArrayLike<number>): void;
    writeFloat(value: number, byteWidth: number): void;
    writeVaruint32(v: number): void;
    writeVarint32(v: number): void;
    writeString(v: string): void;
    getData(): Uint8Array;
    getBytes(): Bytes;
}

/** A self-describing object that can be ABI encoded and decoded. */
type ABISerializable = ABISerializableObject | string | boolean | ABISerializable[] | {
    [key: string]: ABISerializable;
};
/** Type describing an ABI type, either a string (e.g. `uint32[]`) or a ABI type class. */
type ABISerializableType = string | ABISerializableConstructor | ABITypeDescriptor;
/** Interface that should be implemented by ABI serializable objects. */
interface ABISerializableObject {
    /** Called when encoding to binary abi format. */
    toABI?(encoder: ABIEncoder): void;
    /** Called when encoding to json abi format. */
    toJSON(): any;
    /** Return true if the object equals the other object passed. */
    equals(other: any): boolean;
}
interface ABITypeModifiers {
    /** Type is optional, defaults to false. */
    optional?: boolean;
    /** Type is an array, defaults to false. */
    array?: boolean;
    /** Type is a binary extension, defaults to false. */
    extension?: boolean;
}
interface ABITypeDescriptor extends ABITypeModifiers {
    /** Type name or class. */
    type: ABISerializableConstructor | string;
}
interface ABIField extends ABITypeDescriptor {
    /** Field name. */
    name: string;
}
interface ABISerializableConstructor {
    /** Name of the type, e.g. `asset`. */
    abiName: string;
    /** For structs, the fields that this type contains. */
    abiFields?: ABIField[];
    /** For structs, the base class this type extends. */
    abiBase?: ABISerializableConstructor;
    /** For variants, the different types this type can represent. */
    abiVariant?: ABITypeDescriptor[];
    /** Alias to another type. */
    abiAlias?: ABITypeDescriptor;
    /** Return value to use when creating a new instance of this type, used when decoding binary extensions. */
    abiDefault?: () => ABISerializable;
    /**
     * Create new instance from JavaScript object.
     * Should also accept an instance of itself and return that unchanged.
     */
    from(value: any): ABISerializable;
    /**
     * Create instance from binary ABI data.
     * @param decoder Decoder instance to read from.
     */
    fromABI?(decoder: ABIDecoder): ABISerializable;
    /**
     * Static ABI encoding can be used to encode non-class types.
     * Will be used in favor of instance.toABI if both exists.
     * @param value The value to encode.
     * @param encoder The encoder to write the value to.
     */
    toABI?(value: any, encoder: ABIEncoder): void;
    /**
     * Create a new instance, don't use this other than from a custom `from` factory method.
     * @internal
     */
    new (...args: any[]): ABISerializableObject;
}

type BlobType = Blob | string;
declare class Blob implements ABISerializableObject {
    static abiName: string;
    /**
     * Create a new Blob instance.
     */
    static from(value: BlobType): Blob;
    static fromString(value: string): Blob;
    readonly array: Uint8Array;
    constructor(array: Uint8Array);
    equals(other: BlobType): boolean;
    get base64String(): string;
    /** UTF-8 string representation of this instance. */
    get utf8String(): string;
    toABI(encoder: ABIEncoder): void;
    toString(): string;
    toJSON(): string;
}

type BytesType = Bytes | ArrayBufferView | ArrayBuffer | ArrayLike<number> | string;
type AnyBytes = BytesType | {
    array: Uint8Array;
};
type BytesEncoding = 'hex' | 'utf8';
declare class Bytes implements ABISerializableObject {
    static abiName: string;
    /**
     * Create a new Bytes instance.
     * @note Make sure to take a [[copy]] before mutating the bytes as the underlying source is not copied here.
     */
    static from(value: AnyBytes, encoding?: BytesEncoding): Bytes;
    static fromString(value: string, encoding?: BytesEncoding): Bytes;
    static fromABI(decoder: ABIDecoder): Bytes;
    static abiDefault(): Bytes;
    static equal(a: BytesType, b: BytesType): boolean;
    static random(length: number): Bytes;
    /** Return true if given value is a valid `BytesType`. */
    static isBytes(value: any): value is BytesType;
    array: Uint8Array;
    constructor(array?: Uint8Array);
    /** Number of bytes in this instance. */
    get length(): number;
    /** Hex string representation of this instance. */
    get hexString(): string;
    /** UTF-8 string representation of this instance. */
    get utf8String(): string;
    /** Mutating. Append bytes to this instance. */
    append(other: AnyBytes): void;
    /** Non-mutating, returns a copy of this instance with appended bytes. */
    appending(other: AnyBytes): Bytes;
    /** Mutating. Pad this instance to length. */
    zeropad(n: number, truncate?: boolean): void;
    /** Non-mutating, returns a copy of this instance with zeros padded. */
    zeropadded(n: number, truncate?: boolean): Bytes;
    /** Mutating. Drop bytes from the start of this instance. */
    dropFirst(n?: number): void;
    /** Non-mutating, returns a copy of this instance with dropped bytes from the start. */
    droppingFirst(n?: number): Bytes;
    copy(): Bytes;
    equals(other: AnyBytes): boolean;
    toString(encoding?: BytesEncoding): string;
    toABI(encoder: ABIEncoder): void;
    toJSON(): string;
}

type ChecksumType = Checksum | BytesType;
declare class Checksum implements ABISerializableObject {
    static abiName: string;
    static byteSize: number;
    static from<T extends typeof Checksum>(this: T, value: ChecksumType): InstanceType<T>;
    static from(value: ChecksumType): unknown;
    static fromABI<T extends typeof Checksum>(this: T, decoder: ABIDecoder): InstanceType<T>;
    static fromABI(decoder: ABIDecoder): unknown;
    static abiDefault<T extends typeof Checksum>(this: T): InstanceType<T>;
    static abiDefault(): unknown;
    readonly array: Uint8Array;
    constructor(array: Uint8Array);
    equals(other: Checksum160Type | Checksum256Type | Checksum512Type): boolean;
    get hexString(): string;
    toABI(encoder: ABIEncoder): void;
    toString(): string;
    toJSON(): string;
}
type Checksum256Type = Checksum256 | BytesType;
declare class Checksum256 extends Checksum {
    static abiName: string;
    static byteSize: number;
    static from(value: Checksum256Type): Checksum256;
    static hash(data: BytesType): Checksum256;
}
type Checksum512Type = Checksum512 | BytesType;
declare class Checksum512 extends Checksum {
    static abiName: string;
    static byteSize: number;
    static from(value: Checksum512Type): Checksum512;
    static hash(data: BytesType): Checksum512;
}
type Checksum160Type = Checksum160 | BytesType;
declare class Checksum160 extends Checksum {
    static abiName: string;
    static byteSize: number;
    static from(value: Checksum160Type): Checksum160;
    static hash(data: BytesType): Checksum160;
}

/** Supported Wire curve types. */
declare enum KeyType {
    K1 = "K1",
    R1 = "R1",
    WA = "WA",
    EM = "EM"
}
declare namespace KeyType {
    function indexFor(value: KeyType): 0 | 2 | 1 | 3;
    function from(value: number | string): KeyType;
}

type IntType = Int | number | string | BN;
/**
 * How to handle integer overflow.
 * - `throw`: Throws an error if value overflows (or underflows).
 * - `truncate`: Truncates or extends bit-pattern with sign extension (C++11 behavior).
 * - `clamp`: Clamps the value within the supported range.
 */
type OverflowBehavior = 'throw' | 'truncate' | 'clamp';
/**
 * How to handle remainder when dividing integers.
 * - `floor`: Round down to nearest integer.
 * - `round`: Round to nearest integer.
 * - `ceil`: Round up to nearest integer.
 */
type DivisionBehavior = 'floor' | 'round' | 'ceil';
/**
 * Binary integer with the underlying value represented by a BN.js instance.
 * Follows C++11 standard for arithmetic operators and conversions.
 * @note This type is optimized for correctness not speed, if you plan to manipulate
 *       integers in a tight loop you're advised to use the underlying BN.js value or
 *       convert to a JavaScript number first.
 */
declare class Int implements ABISerializableObject {
    static abiName: string;
    static isSigned: boolean;
    static byteWidth: number;
    /** Largest value that can be represented by this integer type. */
    static get max(): BN;
    /** Smallest value that can be represented by this integer type. */
    static get min(): BN;
    /** Add `lhs` to `rhs` and return the resulting value. */
    static add(lhs: Int, rhs: Int, overflow?: OverflowBehavior): Int;
    /** Add `lhs` to `rhs` and return the resulting value. */
    static sub(lhs: Int, rhs: Int, overflow?: OverflowBehavior): Int;
    /** Multiply `lhs` by `rhs` and return the resulting value. */
    static mul(lhs: Int, rhs: Int, overflow?: OverflowBehavior): Int;
    /**
     * Divide `lhs` by `rhs` and return the quotient, dropping the remainder.
     * @throws When dividing by zero.
     */
    static div(lhs: Int, rhs: Int, overflow?: OverflowBehavior): Int;
    /**
     * Divide `lhs` by `rhs` and return the quotient + remainder rounded to the closest integer.
     * @throws When dividing by zero.
     */
    static divRound(lhs: Int, rhs: Int, overflow?: OverflowBehavior): Int;
    /**
     * Divide `lhs` by `rhs` and return the quotient + remainder rounded up to the closest integer.
     * @throws When dividing by zero.
     */
    static divCeil(lhs: Int, rhs: Int, overflow?: OverflowBehavior): Int;
    /** Compare `lhs` to `rhs` and return true if `lhs` is greater than `rhs`. */
    static gt(lhs: Int, rhs: Int): boolean;
    /** Compare `lhs` to `rhs` and return true if `lhs` is less than `rhs`. */
    static lt(lhs: Int, rhs: Int): boolean;
    /** Compare `lhs` to `rhs` and return true if `lhs` is greater than or equal to `rhs`. */
    static gte(lhs: Int, rhs: Int): boolean;
    /** Compare `lhs` to `rhs` and return true if `lhs` is less than or equal to `rhs`. */
    static lte(lhs: Int, rhs: Int): boolean;
    /**
     * Can be used to implement custom operator.
     * @internal
     */
    static operator(lhs: Int, rhs: Int, overflow: OverflowBehavior | undefined, fn: (lhs: BN, rhs: BN) => BN): Int;
    /**
     * Create a new instance from value.
     * @param value Value to create new Int instance from, can be a string, number,
     *              little-endian byte array or another Int instance.
     * @param overflow How to handle integer overflow, default behavior is to throw.
     */
    static from<T extends typeof Int>(this: T, value: IntType | Uint8Array, overflow?: OverflowBehavior): InstanceType<T>;
    static from(value: any, overflow?: OverflowBehavior): unknown;
    static fromABI<T extends typeof Int>(this: T, decoder: ABIDecoder): InstanceType<T>;
    static fromABI(decoder: ABIDecoder): unknown;
    static abiDefault(): Int;
    static random<T extends typeof Int>(this: T): InstanceType<T>;
    static random(): unknown;
    /**
     * The underlying BN.js instance – don't modify this
     * directly – take a copy first using `.clone()`.
     */
    value: BN;
    /**
     * Create a new instance, don't use this directly. Use the `.from` factory method instead.
     * @throws If the value over- or under-flows the integer type.
     */
    constructor(value: BN);
    /**
     * Cast this integer to other type.
     * @param overflow How to handle overflow, default is to preserve bit-pattern (C++11 behavior).
     */
    cast<T extends typeof Int>(type: T, overflow?: OverflowBehavior): InstanceType<T>;
    /** Number as bytes in little endian (matches memory layout in C++ contract). */
    get byteArray(): Uint8Array;
    /**
     * Compare two integers, if strict is set to true the test will only consider integers
     * of the exact same type. I.e. Int64.from(1).equals(UInt64.from(1)) will return false.
     */
    equals(other: IntType | Uint8Array, strict?: boolean): boolean;
    /** Mutating add. */
    add(num: IntType): void;
    /** Non-mutating add. */
    adding(num: IntType): this;
    /** Mutating subtract. */
    subtract(num: IntType): void;
    /** Non-mutating subtract. */
    subtracting(num: IntType): this;
    /** Mutating multiply. */
    multiply(by: IntType): void;
    /** Non-mutating multiply. */
    multiplying(by: IntType): this;
    /**
     * Mutating divide.
     * @param behavior How to handle the remainder, default is to floor (round down).
     * @throws When dividing by zero.
     */
    divide(by: IntType, behavior?: DivisionBehavior): void;
    /**
     * Non-mutating divide.
     * @param behavior How to handle the remainder, default is to floor (round down).
     * @throws When dividing by zero.
     */
    dividing(by: IntType, behavior?: DivisionBehavior): this;
    /** Greater than comparision operator */
    gt(other: Int): boolean;
    /** Less than comparision operator */
    lt(other: Int): boolean;
    /** Greater than or equal comparision operator */
    gte(other: Int): boolean;
    /** Less than or equal comparision operator */
    lte(other: Int): boolean;
    /**
     * Run operator with C++11 implicit conversion.
     * @internal
     */
    private operator;
    /**
     * Convert to a JavaScript number.
     * @throws If the number cannot be represented by 53-bits.
     **/
    toNumber(): number;
    toString(): string;
    [Symbol.toPrimitive](type: string): string | number;
    toABI(encoder: ABIEncoder): void;
    toJSON(): string | number;
}
type Int8Type = Int8 | IntType;
declare class Int8 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type Int16Type = Int16 | IntType;
declare class Int16 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type Int32Type = Int32 | IntType;
declare class Int32 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type Int64Type = Int64 | IntType;
declare class Int64 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type Int128Type = Int128 | IntType;
declare class Int128 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type UInt8Type = UInt8 | IntType;
declare class UInt8 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type UInt16Type = UInt16 | IntType;
declare class UInt16 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type UInt32Type = UInt32 | IntType;
declare class UInt32 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type UInt64Type = UInt64 | IntType;
declare class UInt64 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type UInt128Type = UInt128 | IntType;
declare class UInt128 extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
}
type UInt256Type = UInt256 | UInt256Parts;
interface UInt256Parts {
    low: number;
    high: number;
}
declare class UInt256 {
    static readonly abiName = "uint256";
    static readonly byteWidth = 32;
    static readonly isSigned = false;
    static readonly DECIMALS = 18;
    static readonly SCALE: BN;
    static readonly MAX_UINT256: BN;
    low: UInt128;
    high: UInt128;
    constructor(low: UInt128, high: UInt128);
    /**
     * Create a UInt256 from a number, string, or UInt128 instance.
     * Interprets all values as 18-decimal fixed-point.
     */
    static from(value: number | string | UInt128): UInt256;
    /**
     * Rereate a UInt256 class from its low and high parts as js numbers
     * Useful when creating UInt256 from the value stored in a smart contract
     */
    static recreate(value: UInt256Parts): UInt256;
    /**
     * Construct a UInt256 from a raw 256-bit BN (no scaling).
     * Internal helper for add/sub/mul/div.
     */
    static fromRaw(raw: BN): UInt256;
    /**
     * Helper to combine `low` + `high` into a single BN that includes the
     * _already-scaled_ 10^18 factor.
     */
    raw(): BN;
    /**
     * Convert the UInt256 to a human-readable string,
     * e.g. "123.456" for internal BN "123456000000000000000".
     */
    toString(): string;
    /**
     * Convert the UInt256 to a JS number if safe; otherwise returns a BN.
     * This "descale" by 10^18 first, so "123.456" comes back as ~123.456 in JS.
     */
    toNumber(): number | BN;
    /**
     * Add another UInt256 (both 18-decimal scaled).
     */
    add(other: UInt256): UInt256;
    /**
     * Subtract another UInt256. Throws if result < 0 (underflow).
     */
    subtract(other: UInt256): UInt256;
    /**
     * Multiply this UInt256 by another, then scale back down by 10^18
     * so final is still 18-decimals.
     *
     * So effectively: (a * b) / 10^18
     */
    multiply(other: UInt256): UInt256;
    /**
     * Divide this UInt256 by another, scaling up the dividend by 10^18
     * first so final is still 18 decimals.
     *
     * So effectively: (a * 10^18) / b
     */
    divide(divisor: UInt256): UInt256;
    /**
     * Modulo. Because both sides are scaled, we just do raw mod.
     * The result is still scaled with 18 decimals.
     */
    modulo(divisor: UInt256): UInt256;
    /**
     * Compare: -1 if this < other, 0 if equal, +1 if this > other.
     */
    compare(other: UInt256): -1 | 0 | 1;
    equals(other: UInt256): boolean;
    greaterThan(other: UInt256): boolean;
    lessThan(other: UInt256): boolean;
    private static u128ToBN;
}
type VarIntType = VarInt | IntType;
declare class VarInt extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
    static fromABI(decoder: ABIDecoder): VarInt;
    toABI(encoder: ABIEncoder): void;
}
type VarUIntType = VarUInt | IntType;
declare class VarUInt extends Int {
    static abiName: string;
    static byteWidth: number;
    static isSigned: boolean;
    static fromABI(decoder: ABIDecoder): VarUInt;
    toABI(encoder: ABIEncoder): void;
}
type AnyInt = Int8Type | Int16Type | Int32Type | Int64Type | Int128Type | UInt8Type | UInt16Type | UInt32Type | UInt64Type | UInt128Type | UInt256Type | VarIntType | VarUIntType;

interface StructConstructor extends ABISerializableConstructor {
    new <T extends Struct>(...args: any[]): T;
    structFields: ABIField[];
}
declare class Struct implements ABISerializableObject {
    static abiName: string;
    static abiFields: ABIField[];
    static abiBase: ABISerializableConstructor;
    static from<T extends StructConstructor>(this: T, value: any): InstanceType<T>;
    static from(value: any): unknown;
    static get structFields(): ABIField[];
    /** @internal */
    constructor(object: any);
    /**
     * Return true if this struct equals the other.
     *
     * Note: This compares the ABI encoded bytes of both structs, subclasses
     *       should implement their own fast equality check when possible.
     */
    equals(other: any): boolean;
    /** @internal */
    toJSON(): any;
}
declare namespace Struct {
    function type(name: string): <T extends StructConstructor>(struct: T) => T;
    function field(type: ABISerializableConstructor | string, options?: ABITypeModifiers): <T extends Struct>(target: T, name: string) => void;
}

declare function TypeAlias(name: string): (typeAlias: any) => any;

interface VariantConstructor extends ABISerializableConstructor {
    new <T extends Variant>(...args: any[]): T;
}
type AnyVariant = Variant | ABISerializable | [string, any];
declare class Variant implements ABISerializableObject {
    static abiName: string;
    static abiVariant: ABITypeDescriptor[];
    static from<T extends VariantConstructor>(this: T, object: AnyVariant): InstanceType<T>;
    static from(object: AnyVariant): unknown;
    value: ABISerializable;
    variantIdx: number;
    /** @internal */
    constructor(variant: [string, ABISerializable]);
    /**
     * Return true if this variant equals the other.
     *
     * Note: This compares the ABI encoded bytes of both variants, subclasses
     *       should implement their own fast equality check when possible.
     */
    equals(other: AnyVariant): boolean;
    get variantName(): string;
    /** @internal */
    toJSON(): ABISerializable[];
}
declare namespace Variant {
    function type(name: string, types: ABISerializableType[]): <T extends VariantConstructor>(variant: T) => T;
}

type FloatType = Float | number | string;
declare class Float implements ABISerializableObject {
    static abiName: string;
    static byteWidth: number;
    static from<T extends typeof Float>(this: T, value: FloatType): InstanceType<T>;
    static from(value: FloatType): unknown;
    static fromABI<T extends typeof Float>(this: T, decoder: ABIDecoder): InstanceType<T>;
    static fromABI(decoder: ABIDecoder): unknown;
    static abiDefault(): Float;
    static random<T extends typeof Float>(this: T): InstanceType<T>;
    static random(): unknown;
    value: number;
    constructor(value: number);
    equals(other: FloatType): boolean;
    toABI(encoder: ABIEncoder): void;
    toString(): string;
    toJSON(): string;
}
type Float32Type = Float32 | FloatType;
declare class Float32 extends Float {
    static abiName: string;
    static byteWidth: number;
    toString(): string;
}
type Float64Type = Float64 | FloatType;
declare class Float64 extends Float {
    static abiName: string;
    static byteWidth: number;
}
type Float128Type = Float128 | BytesType;
declare class Float128 implements ABISerializableObject {
    static abiName: string;
    static byteWidth: number;
    static from(value: Float128Type): Float128;
    static fromABI(decoder: ABIDecoder): Float128;
    static random(): Float128;
    data: Bytes;
    constructor(data: Bytes);
    equals(other: Float128Type): boolean;
    toABI(encoder: ABIEncoder): void;
    toString(): string;
    toJSON(): string;
}

/** Type representing a name. */
type NameType = Name | UInt64 | string;
declare class Name implements ABISerializableObject {
    static abiName: string;
    /** Regex pattern matching a Wire name, case-sensitive. */
    static pattern: RegExp;
    /** The numeric representation of the name. */
    value: UInt64;
    /**
     * The raw representation of the name.
     * @deprecated Use value instead.
     */
    get rawValue(): UInt64;
    /** Create a new Name instance from any of its representing types. */
    static from(value: NameType): Name;
    static fromABI(decoder: ABIDecoder): Name;
    static abiDefault(): Name;
    constructor(value: UInt64);
    /** Return true if this name is equal to passed name. */
    equals(other: NameType): boolean;
    /** Return string representation of this name. */
    toString(): string;
    toABI(encoder: ABIEncoder): void;
    /** @internal */
    toJSON(): string;
}

type TimePointType = TimePoint | TimePointSec | string | Date | AnyInt;
interface TimePointConstructor {
    from(value: TimePointType): TimePointBase;
    fromInteger(value: AnyInt): TimePointBase;
    fromDate(value: Date): TimePointBase;
    fromString(value: string): TimePointBase;
    fromMilliseconds(value: number): TimePointBase;
    new (...args: any[]): TimePointBase;
}
declare class TimePointBase implements ABISerializableObject {
    static abiName: string;
    static from<T extends TimePointConstructor>(this: T, value: TimePointType): InstanceType<T>;
    static from(value: TimePointType): unknown;
    static fromString<T extends TimePointConstructor>(this: T, string: string): InstanceType<T>;
    static fromString(string: string): unknown;
    static fromDate<T extends TimePointConstructor>(this: T, date: Date): InstanceType<T>;
    static fromDate(date: Date): unknown;
    static abiDefault<T extends TimePointConstructor>(this: T): InstanceType<T>;
    toABI(encoder: ABIEncoder): void;
    equals(other: TimePointType): boolean;
    toMilliseconds(): number;
    toDate(): Date;
    toJSON(): string;
}
/** Timestamp with microsecond accuracy. */
declare class TimePoint extends TimePointBase {
    static abiName: string;
    static fromMilliseconds(ms: number): TimePoint;
    static fromInteger(value: Int64Type): TimePoint;
    static fromABI(decoder: ABIDecoder): TimePoint;
    value: Int64;
    constructor(value: Int64);
    toString(): string;
    toMilliseconds(): number;
}
/** Timestamp with second accuracy. */
declare class TimePointSec extends TimePointBase {
    static abiName: string;
    static fromMilliseconds(ms: number): TimePointSec;
    static fromInteger(value: UInt32Type): TimePointSec;
    static fromABI(decoder: ABIDecoder): TimePointSec;
    value: UInt32;
    constructor(value: UInt32);
    toString(): string;
    toMilliseconds(): number;
}
declare class BlockTimestamp extends TimePointBase {
    static abiName: string;
    static fromMilliseconds(ms: number): BlockTimestamp;
    static fromInteger(value: UInt32Type): BlockTimestamp;
    static fromABI(decoder: ABIDecoder): BlockTimestamp;
    value: UInt32;
    constructor(value: UInt32);
    toString(): string;
    toMilliseconds(): number;
}

type ABIDef = string | Partial<ABI.Def> | ABI | Blob;
declare class ABI implements ABISerializableObject {
    static abiName: string;
    static version: string;
    version: string;
    types: ABI.TypeDef[];
    variants: ABI.Variant[];
    structs: ABI.Struct[];
    actions: ABI.Action[];
    tables: ABI.Table[];
    ricardian_clauses: ABI.Clause[];
    action_results: ABI.ActionResult[];
    constructor(args: Partial<ABI.Def>);
    static from(value: ABIDef): ABI;
    static fromABI(decoder: ABIDecoder): ABI;
    toABI(encoder: ABIEncoder): void;
    resolveType(name: string): ABI.ResolvedType;
    resolveAll(): {
        types: ABI.ResolvedType[];
        variants: ABI.ResolvedType[];
        structs: ABI.ResolvedType[];
    };
    private resolve;
    getStruct(name: string): ABI.Struct | undefined;
    getVariant(name: string): ABI.Variant | undefined;
    /** Return arguments type of an action in this ABI. */
    getActionType(actionName: NameType): string | undefined;
    equals(other: ABIDef): boolean;
    toJSON(): {
        version: string;
        types: ABI.TypeDef[];
        structs: ABI.Struct[];
        actions: ABI.Action[];
        tables: ABI.Table[];
        ricardian_clauses: ABI.Clause[];
        error_messages: never[];
        abi_extensions: never[];
        variants: ABI.Variant[];
        action_results: ABI.ActionResult[];
    };
}
declare namespace ABI {
    interface TypeDef {
        new_type_name: string;
        type: string;
    }
    interface Field {
        name: string;
        type: string;
    }
    interface Struct {
        name: string;
        base: string;
        fields: Field[];
    }
    interface Action {
        name: NameType;
        type: string;
        ricardian_contract: string;
    }
    interface Table {
        name: NameType;
        index_type: string;
        key_names: string[];
        key_types: string[];
        type: string;
    }
    interface Clause {
        id: string;
        body: string;
    }
    interface Variant {
        name: string;
        types: string[];
    }
    interface Def {
        version: string;
        types: TypeDef[];
        variants: Variant[];
        structs: Struct[];
        actions: Action[];
        tables: Table[];
        ricardian_clauses: Clause[];
        action_results: ActionResult[];
    }
    interface ActionResult {
        name: NameType;
        result_type: string;
    }
    class ResolvedType {
        name: string;
        id: number;
        isArray: boolean;
        isOptional: boolean;
        isExtension: boolean;
        base?: ResolvedType;
        fields?: {
            name: string;
            type: ResolvedType;
        }[];
        variant?: ResolvedType[];
        ref?: ResolvedType;
        constructor(fullName: string, id?: number);
        /**
         * Type name including suffixes: [] array, ? optional, $ binary ext
         */
        get typeName(): string;
        /** All fields including base struct(s), undefined if not a struct type. */
        get allFields(): {
            name: string;
            type: ResolvedType;
        }[] | undefined;
    }
}

type AssetType = Asset | string;
declare class Asset implements ABISerializableObject {
    static abiName: string;
    units: Int64;
    symbol: Asset.Symbol;
    static from(value: AssetType): Asset;
    static from(value: number, symbol: Asset.SymbolType): Asset;
    static fromString(value: string): Asset;
    static fromFloat(value: number, symbol: Asset.SymbolType): Asset;
    static fromUnits(value: Int64Type, symbol: Asset.SymbolType): Asset;
    static fromABI(decoder: ABIDecoder): Asset;
    static abiDefault(): Asset;
    static formatUnits(units: Int64Type, precision: number): string;
    constructor(units: Int64, symbol: Asset.Symbol);
    equals(other: AssetType): boolean;
    get value(): number;
    set value(newValue: number);
    get quantity(): string;
    toABI(encoder: ABIEncoder): void;
    toString(): string;
    toJSON(): string;
}
declare namespace Asset {
    type SymbolType = Symbol | UInt64 | string;
    class Symbol implements ABISerializableObject {
        static abiName: string;
        static maxPrecision: number;
        static from(value: SymbolType): Symbol;
        static fromParts(name: string, precision: number): Symbol;
        static fromABI(decoder: ABIDecoder): Symbol;
        static abiDefault(): Symbol;
        value: UInt64;
        constructor(value: UInt64);
        equals(other: SymbolType): boolean;
        get name(): string;
        get precision(): number;
        get code(): SymbolCode;
        toABI(encoder: ABIEncoder): void;
        /**
         * Convert units to floating point number according to symbol precision.
         * @throws If the given units can't be represented in 53 bits.
         **/
        convertUnits(units: Int64): number;
        /**
         * Convert floating point to units according to symbol precision.
         * Note that the value will be rounded to closest precision.
         **/
        convertFloat(float: number): Int64;
        toString(): string;
        toJSON(): string;
    }
    type SymbolCodeType = SymbolCode | UInt64 | string | number;
    class SymbolCode implements ABISerializableObject {
        static abiName: string;
        static pattern: RegExp;
        static from(value: SymbolCodeType): SymbolCode;
        static fromABI(decoder: ABIDecoder): SymbolCode;
        static abiDefault(): SymbolCode;
        value: UInt64;
        constructor(value: UInt64);
        equals(other: SymbolCodeType): boolean;
        toABI(encoder: ABIEncoder): void;
        toString(): string;
        toJSON(): string;
    }
}
type ExtendedAssetType = ExtendedAsset | {
    quantity: AssetType;
    contract: NameType;
};
declare class ExtendedAsset implements ABISerializableObject {
    static abiName: string;
    static from(value: ExtendedAssetType): ExtendedAsset;
    static fromABI(decoder: ABIDecoder): ExtendedAsset;
    quantity: Asset;
    contract: Name;
    constructor(quantity: Asset, contract: Name);
    equals(other: ExtendedAssetType): boolean;
    toABI(encoder: ABIEncoder): void;
    toJSON(): {
        quantity: Asset;
        contract: Name;
    };
}
type ExtendedSymbolType = ExtendedSymbol | {
    sym: Asset.SymbolType;
    contract: NameType;
};
declare class ExtendedSymbol implements ABISerializableObject {
    static abiName: string;
    static from(value: ExtendedSymbolType): ExtendedSymbol;
    static fromABI(decoder: ABIDecoder): ExtendedSymbol;
    sym: Asset.Symbol;
    contract: Name;
    constructor(sym: Asset.Symbol, contract: Name);
    equals(other: ExtendedSymbolType): boolean;
    toABI(encoder: ABIEncoder): void;
    toJSON(): {
        sym: Asset.Symbol;
        contract: Name;
    };
}

type PublicKeyType = PublicKey | string | {
    type: string;
    compressed: Uint8Array;
};
declare class PublicKey implements ABISerializableObject {
    static abiName: string;
    /** Type, e.g. `K1` */
    type: KeyType;
    /** Compressed public key point. */
    data: Bytes;
    /** Create PublicKey object from representing types. */
    static from(value: PublicKeyType): PublicKey;
    /** @internal */
    static fromABI(decoder: ABIDecoder): PublicKey;
    /** @internal */
    constructor(type: KeyType, data: Bytes);
    equals(other: PublicKeyType): boolean;
    /**
     * Return Antelope/EOSIO legacy (`EOS<base58data>`) formatted key.
     * @throws If the key type isn't `K1` or 'EM'.
     */
    toLegacyString(prefix?: string): string;
    /** Return key in modern Antelope/EOSIO format (`PUB_<type>_<base58data>`) */
    toString(): string;
    /** @internal */
    toABI(encoder: ABIEncoder): void;
    /** @internal */
    toJSON(): string;
}

type SignatureType = Signature | string | {
    type: string;
    r: Uint8Array;
    s: Uint8Array;
    recid: number;
};
declare class Signature implements ABISerializableObject {
    static abiName: string;
    /** Type, e.g. `K1` */
    type: KeyType;
    /** Signature data. */
    data: Bytes;
    /** Create Signature object from representing types. */
    static from(value: SignatureType): Signature;
    /** @internal */
    static fromABI(decoder: ABIDecoder): Signature;
    /** @internal */
    constructor(type: KeyType, data: Bytes);
    equals(other: SignatureType): boolean;
    /** Recover public key from given message digest. */
    recoverDigest(digest: Checksum256Type): PublicKey;
    /** Recover public key from given message. */
    recoverMessage(message: BytesType): PublicKey;
    /** Verify this signature with given message digest and public key. */
    verifyDigest(digest: Checksum256Type, publicKey: PublicKey): boolean;
    /** Verify this signature with given message and public key. */
    verifyMessage(message: BytesType, publicKey: PublicKey): boolean;
    /** Base58check encoded string representation of this signature (`SIG_<type>_<data>`). */
    toString(): string;
    /** @internal */
    toABI(encoder: ABIEncoder): void;
    /** @internal */
    toJSON(): string;
}

type PrivateKeyType = PrivateKey | string;
declare class PrivateKey {
    type: KeyType;
    data: Bytes;
    /** Create PrivateKey object from representing types. */
    static from(value: PrivateKeyType): PrivateKey;
    /**
     * Create PrivateKey object from a string representation.
     * Accepts WIF (5...) and Antelope/EOSIO (PVT_...) style private keys.
     */
    static fromString(string: string, ignoreChecksumError?: boolean): PrivateKey;
    /**
     * Generate new PrivateKey.
     * @throws If a secure random source isn't available.
     */
    static generate(type: KeyType | string): PrivateKey;
    /** @internal */
    constructor(type: KeyType, data: Bytes);
    /**
     * Sign message digest using this key.
     * @throws If the key type isn't R1 or K1.
     */
    signDigest(digest: Checksum256Type): Signature;
    /**
     * Sign message using this key.
     * @throws If the key type isn't R1 or K1.
     */
    signMessage(message: BytesType): Signature;
    /**
     * Derive the shared secret between this private key and given public key.
     * @throws If the key type isn't R1 or K1.
     */
    sharedSecret(publicKey: PublicKey): Checksum512;
    /**
     * Get the corresponding public key.
     * @throws If the key type isn't R1 or K1.
     */
    toPublic(): PublicKey;
    /**
     * Return WIF representation of this private key
     * @throws If the key type isn't K1/EM.
     */
    toWif(): string;
    /**
     * Return the key in Antelope/EOSIO PVT_<type>_<base58check> format.
     */
    toString(): string;
    toJSON(): string;
}

type PermissionLevelType = PermissionLevel | {
    actor: NameType;
    permission: NameType;
};
/** Permission Level, a.k.a "auth". */
declare class PermissionLevel extends Struct {
    actor: Name;
    permission: Name;
    /** Create new permission level from representing types. Can be expressed as a string in the format `<actor>@<permission>`. */
    static from(value: PermissionLevelType | string): PermissionLevel;
    /** Return true if this permission level equals other. */
    equals(other: PermissionLevelType | string): boolean;
    toString(): string;
}

interface ActionBase {
    /** The account (a.k.a. contract) to run action on. */
    account: NameType;
    /** The name of the action. */
    name: NameType;
    /** The permissions authorizing the action. */
    authorization: PermissionLevelType[];
}
interface ActionFields extends ActionBase {
    /** The ABI-encoded action data. */
    data: BytesType;
}
/** Action type that may or may not have its data encoded */
interface AnyAction extends ActionBase {
    data: BytesType | ABISerializableObject | Record<string, any> | any;
}
type ActionType = Action$1 | ActionFields;
declare class Action$1 extends Struct {
    /** The account (a.k.a. contract) to run action on. */
    account: Name;
    /** The name of the action. */
    name: Name;
    /** The permissions authorizing the action. */
    authorization: PermissionLevel[];
    /** The ABI-encoded action data. */
    data: Bytes;
    abi?: ABI;
    static from(anyAction: ActionType | AnyAction, abi?: ABIDef): Action$1;
    /** Return true if this Action is equal to given action. */
    equals(other: ActionType | AnyAction): boolean;
    /** Return action data decoded as given type or using ABI. */
    decodeData<T extends ABISerializableConstructor>(type: T): InstanceType<T>;
    decodeData<T extends keyof BuiltinTypes>(type: T): BuiltinTypes[T];
    decodeData(abi: ABIDef): ABISerializable;
    get decoded(): any;
}

declare class TransactionExtension extends Struct {
    type: UInt16;
    data: Bytes;
}
interface TransactionHeaderFields {
    /** The time at which a transaction expires. */
    expiration: TimePointType;
    /** *Specifies a block num in the last 2^16 blocks. */
    ref_block_num: UInt16Type;
    /** Specifies the lower 32 bits of the block id. */
    ref_block_prefix: UInt32Type;
    /** Upper limit on total network bandwidth (in 8 byte words) billed for this transaction. */
    max_net_usage_words?: VarUIntType;
    /** Upper limit on the total CPU time billed for this transaction. */
    max_cpu_usage_ms?: UInt8Type;
    /** Number of seconds to delay this transaction for during which it may be canceled. */
    delay_sec?: VarUIntType;
}
type TransactionHeaderType = TransactionHeader | TransactionHeaderFields;
declare class TransactionHeader extends Struct {
    /** The time at which a transaction expires. */
    expiration: TimePointSec;
    /** *Specifies a block num in the last 2^16 blocks. */
    ref_block_num: UInt16;
    /** Specifies the lower 32 bits of the block id. */
    ref_block_prefix: UInt32;
    /** Upper limit on total network bandwidth (in 8 byte words) billed for this transaction. */
    max_net_usage_words: VarUInt;
    /** Upper limit on the total CPU time billed for this transaction. */
    max_cpu_usage_ms: UInt8;
    /** Number of seconds to delay this transaction for during which it may be canceled. */
    delay_sec: VarUInt;
    static from(object: TransactionHeaderType): TransactionHeader;
}
interface TransactionFields extends TransactionHeaderFields {
    /** The context free actions in the transaction. */
    context_free_actions?: ActionType[];
    /** The actions in the transaction. */
    actions?: ActionType[];
    /** Transaction extensions. */
    transaction_extensions?: {
        type: UInt16Type;
        data: BytesType;
    }[];
}
interface AnyTransaction extends TransactionHeaderFields {
    /** The context free actions in the transaction. */
    context_free_actions?: AnyAction[];
    /** The actions in the transaction. */
    actions?: AnyAction[];
    /** Transaction extensions. */
    transaction_extensions?: {
        type: UInt16Type;
        data: BytesType;
    }[];
}
type TransactionType = Transaction | TransactionFields;
declare class Transaction extends TransactionHeader {
    /** The context free actions in the transaction. */
    context_free_actions: Action$1[];
    /** The actions in the transaction. */
    actions: Action$1[];
    /** Transaction extensions. */
    transaction_extensions: TransactionExtension[];
    static from(object: TransactionType | AnyTransaction, abis?: ABIDef | {
        contract: NameType;
        abi: ABIDef;
    }[]): Transaction;
    /** Return true if this transaction is equal to given transaction. */
    equals(other: TransactionType): boolean;
    get id(): Checksum256;
    signingDigest(chainId: Checksum256Type): Checksum256;
    signingData(chainId: Checksum256Type): Bytes;
}
interface SignedTransactionFields extends TransactionFields {
    /** List of signatures. */
    signatures?: SignatureType[];
    /** Context-free action data, for each context-free action, there is an entry here. */
    context_free_data?: BytesType[];
}
type SignedTransactionType = SignedTransaction | SignedTransactionFields;
declare class SignedTransaction extends Transaction {
    /** List of signatures. */
    signatures: Signature[];
    /** Context-free action data, for each context-free action, there is an entry here. */
    context_free_data: Bytes[];
    /** The transaction without the signatures. */
    get transaction(): Transaction;
    get id(): Checksum256;
    static from(object: SignedTransactionType): SignedTransaction;
}
type PackedTransactionType = PackedTransaction | {
    signatures?: SignatureType[];
    compression?: UInt8Type;
    packed_context_free_data?: BytesType;
    packed_trx: BytesType;
};
declare enum CompressionType {
    none = 0,
    zlib = 1
}
declare class PackedTransaction extends Struct {
    signatures: Signature[];
    compression: UInt8;
    packed_context_free_data: Bytes;
    packed_trx: Bytes;
    static from(object: PackedTransactionType): PackedTransaction;
    static fromSigned(signed: SignedTransaction, compression?: CompressionType): PackedTransaction;
    getTransaction(): Transaction;
    getSignedTransaction(): SignedTransaction;
}
declare class TransactionReceipt extends Struct {
    status: string;
    cpu_usage_us: UInt32;
    net_usage_words: UInt32;
}

declare class Weight extends UInt16 {
}
declare class KeyWeight extends Struct {
    key: PublicKey;
    weight: Weight;
}
declare class PermissionLevelWeight extends Struct {
    permission: PermissionLevel;
    weight: Weight;
}
declare class WaitWeight extends Struct {
    wait_sec: UInt32;
    weight: Weight;
}
type AuthorityType = Authority | {
    threshold: UInt32Type;
    keys?: {
        key: PublicKeyType;
        weight: UInt16Type;
    }[];
    accounts?: {
        permission: PermissionLevelType;
        weight: UInt16Type;
    }[];
    waits?: {
        wait_sec: UInt32Type;
        weight: UInt16Type;
    }[];
};
declare class Authority extends Struct {
    threshold: UInt32;
    keys: KeyWeight[];
    accounts: PermissionLevelWeight[];
    waits: WaitWeight[];
    static from(value: AuthorityType): Authority;
    /** Total weight of all waits. */
    get waitThreshold(): number;
    /** Weight a key needs to sign for this authority. */
    get keyThreshold(): number;
    /** Return the weight for given public key, or zero if it is not included in this authority. */
    keyWeight(publicKey: PublicKeyType): number;
    /**
     * Check if given public key has permission in this authority,
     * @attention Does not take indirect permissions for the key via account weights into account.
     * @param publicKey The key to check.
     * @param includePartial Whether to consider auths where the key is included but can't be reached alone (e.g. multisig).
     */
    hasPermission(publicKey: PublicKeyType, includePartial?: boolean): boolean;
    /**
     * Sorts the authority weights in place, should be called before including the authority in a `updateauth` action or it might be rejected.
     */
    sort(): void;
}

declare namespace Serializer {
    const encode: typeof abiEncode;
    const decode: typeof abiDecode;
    /** Create an Antelope/EOSIO ABI definition for given core type. */
    function synthesize(type: ABISerializableConstructor): ABI;
    /** Create JSON representation of a core object. */
    function stringify(object: ABISerializable): string;
    /** Create a vanilla js representation of a core object. */
    function objectify(object: ABISerializable): any;
}

type BlockIdType = BlockId | BytesType | {
    blockNum: UInt32Type;
    checksum: Checksum256Type;
};
declare class BlockId implements ABISerializableObject {
    static abiName: string;
    static from(value: BlockIdType): BlockId;
    static fromABI(decoder: ABIDecoder): BlockId;
    static fromBlockChecksum(checksum: Checksum256Type, blockNum: UInt32Type): BlockId;
    readonly array: Uint8Array;
    constructor(array: Uint8Array);
    equals(other: BlockIdType): boolean;
    toABI(encoder: ABIEncoder): void;
    toString(): string;
    toJSON(): string;
    get hexString(): string;
    get blockNum(): UInt32;
}

declare namespace Base58 {
    enum ErrorCode {
        E_CHECKSUM = "E_CHECKSUM",
        E_INVALID = "E_INVALID"
    }
    class DecodingError extends Error {
        readonly code: ErrorCode;
        readonly info: Record<string, any>;
        static __className: string;
        constructor(message: string, code: ErrorCode, info?: Record<string, any>);
    }
    /** Decode a Base58 encoded string. */
    function decode(s: string, size?: number): Bytes;
    /** Decode a Base58Check encoded string. */
    function decodeCheck(encoded: string, size?: number): Bytes;
    /** Decode a Base58Check encoded string that uses ripemd160 instead of double sha256 for the digest. */
    function decodeRipemd160Check(encoded: string, size?: number, suffix?: string): Bytes;
    /** Encode bytes to a Base58 string.  */
    function encode(data: BytesType): string;
    function encodeCheck(data: BytesType): string;
    function encodeRipemd160Check(data: BytesType, suffix?: string): string;
}

declare function arrayEquals(a: ArrayLike<number>, b: ArrayLike<number>): boolean;
declare function arrayEquatableEquals(a: ABISerializableObject[], b: ABISerializableObject[]): boolean;
declare function arrayToHex(array: ArrayLike<number>): string;
declare function hexToArray(hex: string): Uint8Array;
/** Generate N random bytes, throws if a secure random source isn't available. */
declare function secureRandom(length: number): Uint8Array;
/** Check if object in instance of class. */
declare function isInstanceOf<T extends {
    new (...args: any[]): InstanceType<T>;
}>(object: any, someClass: T): object is InstanceType<T>;

type Fetch$1 = (input: any, init?: any) => Promise<any>;
/** Response to an API call.  */
interface APIResponse {
    json?: any;
    text: string;
    status: number;
    headers: Record<string, string>;
}
interface APIProvider {
    /**
     * Call an API endpoint and return the response.
     * Provider is responsible for JSON encoding the params and decoding the response.
     * @argument path The endpoint path, e.g. `/v1/chain/get_info`
     * @argument params The request body if any.
     */
    call(args: {
        path: string;
        params?: unknown;
        method?: APIMethods;
    }): Promise<APIResponse>;
}
interface FetchProviderOptions {
    /**
     * Fetch instance, must be provided in non-browser environments.
     * You can use the node-fetch package in Node.js.
     */
    fetch?: Fetch$1;
    /**
     * Headers that will be applied to every request
     * */
    headers?: Record<string, string>;
}
/** Default provider that uses the Fetch API to call a single node. */
declare class FetchProvider implements APIProvider {
    readonly url: string;
    readonly fetch: Fetch$1;
    readonly headers: Record<string, string>;
    constructor(url: string, options?: FetchProviderOptions);
    call(args: {
        path: string;
        params?: Record<string, unknown>;
        method?: APIMethods;
        headers?: Record<string, string>;
    }): Promise<APIResponse>;
}

declare class AccountLinkedAction extends Struct {
    account: Name;
    action: Name;
}
declare class AccountPermission extends Struct {
    perm_name: Name;
    parent: Name;
    required_auth: Authority;
    linked_actions: AccountLinkedAction[];
}
declare class AccountResourceLimit extends Struct {
    used: Int64;
    available: Int64;
    max: Int64;
    last_usage_update_time: TimePoint;
    current_used: Int64;
}
declare class AccountTotalResources extends Struct {
    owner: Name;
    net_weight: Asset;
    cpu_weight: Asset;
    ram_bytes: UInt64;
}
declare class AccountSelfDelegatedBandwidth extends Struct {
    from: Name;
    to: Name;
    net_weight: Asset;
    cpu_weight: Asset;
}
declare class AccountRefundRequest extends Struct {
    owner: Name;
    request_time: TimePoint;
    net_amount: Asset;
    cpu_amount: Asset;
}
declare class AccountVoterInfo extends Struct {
    owner: Name;
    proxy: Name;
    producers: Name[];
    staked?: Int64;
    last_vote_weight: Float64;
    proxied_vote_weight: Float64;
    is_proxy: boolean;
    flags1?: UInt32;
    reserved2: UInt32;
    reserved3: string;
}
declare class AccountRexInfoMaturities extends Struct {
    /** Expected results from after EOSIO.Contracts v1.9.0 */
    key?: TimePoint;
    value?: Int64;
    /** Expected results from before EOSIO.Contracts v1.9.0 */
    first?: TimePoint;
    second?: Int64;
}
declare class AccountRexInfo extends Struct {
    version: UInt32;
    owner: Name;
    vote_stake: Asset;
    rex_balance: Asset;
    matured_rex: Int64;
    rex_maturities: AccountRexInfoMaturities[];
}
interface GetAbiResponse {
    account_name: string;
    abi?: ABI.Def;
}
declare class GetRawAbiResponse extends Struct {
    account_name: Name;
    code_hash: Checksum256;
    abi_hash: Checksum256;
    abi: Blob;
}
declare class AccountObject extends Struct {
    /** The account name of the retrieved account */
    account_name: Name;
    /** Highest block number on the chain */
    head_block_num: UInt32;
    /** Highest block unix timestamp. */
    head_block_time: TimePoint;
    /** Indicator of if this is a privileged system account */
    privileged: boolean;
    /** Last update to accounts contract as unix timestamp. */
    last_code_update: TimePoint;
    /** Account created as unix timestamp. */
    created: TimePoint;
    /** Account core token balance */
    core_liquid_balance?: Asset;
    ram_quota: Int64;
    net_weight: Int64;
    cpu_weight: Int64;
    net_limit: AccountResourceLimit;
    cpu_limit: AccountResourceLimit;
    subjective_cpu_bill_limit: AccountResourceLimit;
    ram_usage: UInt64;
    permissions: AccountPermission[];
    total_resources: AccountTotalResources;
    self_delegated_bandwidth?: AccountSelfDelegatedBandwidth;
    refund_request?: AccountRefundRequest;
    voter_info?: AccountVoterInfo;
    rex_info?: AccountRexInfo;
    getPermission(permission: NameType): AccountPermission;
}
declare class AccountByAuthorizersRow extends Struct {
    account_name: Name;
    permission_name: Name;
    authorizing_key: PublicKey;
    authorizing_account: PermissionLevel;
    weight: Weight;
    threshold: UInt32;
}
declare class AccountsByAuthorizers extends Struct {
    accounts: AccountByAuthorizersRow[];
}
declare class NewProducersEntry$1 extends Struct {
    producer_name: Name;
    block_signing_key: PublicKey;
}
declare class NewProducers$1 extends Struct {
    version: UInt32;
    producers: NewProducersEntry$1;
}
declare class BlockExtension$1 extends Struct {
    type: UInt16;
    data: Bytes;
}
declare class HeaderExtension$1 extends Struct {
    type: UInt16;
    data: Bytes;
}
declare class TrxVariant$1 implements ABISerializableObject {
    readonly id: Checksum256;
    readonly extra: Record<string, any>;
    static abiName: string;
    static from(data: any): TrxVariant$1;
    constructor(id: Checksum256, extra: Record<string, any>);
    get transaction(): Transaction | undefined;
    get signatures(): Signature[] | undefined;
    equals(other: any): boolean;
    toJSON(): Checksum256;
}
declare class GetBlockResponseTransactionReceipt extends TransactionReceipt {
    trx: TrxVariant$1;
    get id(): Checksum256;
}
declare class GetBlockResponse extends Struct {
    timestamp: TimePoint;
    producer: Name;
    confirmed: UInt16;
    previous: BlockId;
    transaction_mroot: Checksum256;
    action_mroot: Checksum256;
    schedule_version: UInt32;
    new_producers?: NewProducers$1;
    header_extensions?: HeaderExtension$1[];
    new_protocol_features?: any;
    producer_signature: Signature;
    transactions: GetBlockResponseTransactionReceipt[];
    block_extensions: BlockExtension$1[];
    id: BlockId;
    block_num: UInt32;
    ref_block_prefix: UInt32;
}
declare class GetBlockInfoResponse extends Struct {
    block_num: UInt32;
    ref_block_num: UInt16;
    id: BlockId;
    timestamp: TimePoint;
    producer: Name;
    confirmed: UInt16;
    previous: BlockId;
    transaction_mroot: Checksum256;
    action_mroot: Checksum256;
    schedule_version: UInt32;
    producer_signature: Signature;
    ref_block_prefix: UInt32;
}
declare class ActiveScheduleProducerAuthority extends Struct {
    producer_name: Name;
    authority: any;
}
declare class ActiveScheduleProducer extends Struct {
    producer_name: Name;
    authority: ActiveScheduleProducerAuthority;
}
declare class ActiveSchedule extends Struct {
    version: UInt32;
    producers: ActiveScheduleProducer[];
}
declare class BlockStateHeader extends Struct {
    timestamp: TimePoint;
    producer: Name;
    confirmed: UInt16;
    previous: BlockId;
    transaction_mroot: Checksum256;
    action_mroot: Checksum256;
    schedule_version: UInt32;
    header_extensions?: HeaderExtension$1[];
    producer_signature: Signature;
}
declare class GetBlockHeaderStateResponse extends Struct {
    block_num: UInt32;
    dpos_proposed_irreversible_blocknum: UInt32;
    dpos_irreversible_blocknum: UInt32;
    id: BlockId;
    header: BlockStateHeader;
    /** Unstructured any fields specific to header state calls */
    active_schedule: any;
    blockroot_merkle: any;
    producer_to_last_produced: any;
    producer_to_last_implied_irb: any;
    valid_block_signing_authority: any;
    confirm_count: any;
    pending_schedule: any;
    activated_protocol_features: any;
    additional_signatures: any;
}
declare class GetInfoResponse extends Struct {
    /** Hash representing the last commit in the tagged release. */
    server_version: string;
    /** Hash representing the ID of the chain. */
    chain_id: Checksum256;
    /** Highest block number on the chain */
    head_block_num: UInt32;
    /** Highest block number on the chain that has been irreversibly applied to state. */
    last_irreversible_block_num: UInt32;
    /** Highest block ID on the chain that has been irreversibly applied to state. */
    last_irreversible_block_id: BlockId;
    /** Highest block ID on the chain. */
    head_block_id: BlockId;
    /** Highest block unix timestamp. */
    head_block_time: TimePoint;
    /** Producer that signed the highest block (head block). */
    head_block_producer: Name;
    /** CPU limit calculated after each block is produced, approximately 1000 times `blockCpuLimit`. */
    virtual_block_cpu_limit: UInt64;
    /** NET limit calculated after each block is produced, approximately 1000 times `blockNetLimit`. */
    virtual_block_net_limit: UInt64;
    /** Actual maximum CPU limit. */
    block_cpu_limit: UInt64;
    /** Actual maximum NET limit. */
    block_net_limit: UInt64;
    /** String representation of server version. */
    server_version_string?: string;
    /** Sequential block number representing the best known head in the fork database tree. */
    fork_db_head_block_num?: UInt32;
    /** Hash representing the best known head in the fork database tree. */
    fork_db_head_block_id?: BlockId;
    getTransactionHeader(secondsAhead?: number): TransactionHeader;
}
interface PushTransactionResponse {
    transaction_id: string;
    processed: {
        id: string;
        block_num: number;
        block_time: string;
        receipt: {
            status: string;
            cpu_usage_us: number;
            net_usage_words: number;
        };
        elapsed: number;
        net_usage: number;
        scheduled: boolean;
        action_traces: any[];
        account_ram_delta: any;
    };
}
interface SendTransactionResponseExceptionStack {
    context: {
        level: string;
        file: string;
        line: number;
        method: string;
        hostname: string;
        thread_name: string;
        timestamp: string;
    };
    format: string;
    data: any;
}
interface SendTransactionResponseException {
    code: number;
    name: string;
    message: string;
    stack: SendTransactionResponseExceptionStack[];
}
interface SendTransactionResponse {
    transaction_id: string;
    processed: {
        id: string;
        block_num: number;
        block_time: string;
        receipt: {
            status: string;
            cpu_usage_us: number;
            net_usage_words: number;
        };
        elapsed: number;
        except?: SendTransactionResponseException;
        net_usage: number;
        scheduled: boolean;
        action_traces: any[];
        account_ram_delta: any;
    };
}
interface SendTransaction2Options {
    return_failure_trace?: boolean;
    retry_trx?: boolean;
    retry_trx_num_blocks?: number;
}
interface SendTransaction2Response {
    transaction_id: string;
    processed: {
        id: string;
        block_num: number;
        block_time: string;
        receipt: {
            status: string;
            cpu_usage_us: number;
            net_usage_words: number;
        };
        elapsed: number;
        net_usage: number;
        scheduled: boolean;
        action_traces: any[];
        account_ram_delta: any;
    };
}
interface TableIndexTypes {
    float128: Float128;
    float64: Float64;
    i128: UInt128;
    i64: UInt64;
    name: Name;
    ripemd160: Checksum160;
    sha256: Checksum256;
}
type TableIndexType = Name | UInt64 | UInt128 | Float64 | Checksum256 | Checksum160;
interface GetTableRowsParams<Index = TableIndexType | string> {
    /** The name of the smart contract that controls the provided table. */
    code: NameType;
    /** Name of the table to query. */
    table: NameType;
    /** The account to which this data belongs, if omitted will be set to be same as `code`. */
    scope?: string | TableIndexType;
    /** Lower lookup bound. */
    lower_bound?: Index;
    /** Upper lookup bound. */
    upper_bound?: Index;
    /** How many rows to fetch, defaults to 10 if unset. */
    limit?: UInt32Type;
    /** Whether to iterate records in reverse order. */
    reverse?: boolean;
    /** Position of the index used, defaults to primary. */
    index_position?: 'primary' | 'secondary' | 'tertiary' | 'fourth' | 'fifth' | 'sixth' | 'seventh' | 'eighth' | 'ninth' | 'tenth';
    /**
     * Whether node should try to decode row data using code abi.
     * Determined automatically based the `type` param if omitted.
     */
    json?: boolean;
    /**
     * Set to true to populate the ram_payers array in the response.
     */
    show_payer?: boolean;
}
interface GetTableRowsParamsKeyed<Index = TableIndexType, Key = keyof TableIndexTypes> extends GetTableRowsParams<Index> {
    /** Index key type, determined automatically when passing a typed `upper_bound` or `lower_bound`. */
    key_type: Key;
}
interface GetTableRowsParamsTyped<Index = TableIndexType | string, Row = ABISerializableType> extends GetTableRowsParams<Index> {
    /** Result type for each row. */
    type: Row;
}
interface GetTableRowsResponse<Index = TableIndexType, Row = any> {
    rows: Row[];
    more: boolean;
    ram_payers?: Name[];
    next_key?: Index;
}
interface GetTableByScopeParams {
    code: NameType;
    table?: NameType;
    lower_bound?: string;
    upper_bound?: string;
    limit?: UInt32Type;
    reverse?: boolean;
}
declare class GetTableByScopeResponseRow extends Struct {
    code: Name;
    scope: Name;
    table: Name;
    payer: Name;
    count: UInt32;
}
declare class GetTableByScopeResponse extends Struct {
    rows: GetTableByScopeResponseRow[];
    more: string;
}
declare class OrderedActionsResult extends Struct {
    global_action_seq: UInt64;
    account_action_seq: Int64;
    block_num: UInt32;
    block_time: BlockTimestamp;
    action_trace?: any;
    irrevirsible?: boolean;
}
declare class GetActionsResponse$1 extends Struct {
    actions: OrderedActionsResult[];
    last_irreversible_block: Int32;
    head_block_num: Int32;
    time_limit_exceeded_error?: boolean;
}
declare class TransactionAuthSequence extends Struct {
    account: string;
    sequence: string;
}
declare class TransactionTraceReceipt extends Struct {
    act_digest: Checksum256;
    auth_sequence: TransactionAuthSequence[];
    global_sequence: string;
    receiver: Name;
    recv_sequence: string;
}
declare class TransactionTrace extends Struct {
    account_ram_deltas: any[];
    act: Action$1;
    block_num: number;
    block_time: BlockTimestamp;
    console: string;
    context_free: boolean;
    elapsed: number;
    except: any;
    inline_traces: TransactionTrace[];
    producer_block_id: Checksum256;
    receipt: TransactionTraceReceipt;
    trx_id: Checksum256;
}
declare class Trx extends Struct {
    actions: AnyAction[];
    context_free_actions: AnyAction[];
    context_free_data: any[];
    delay_sec: number;
    expiration: string;
    max_cpu_usage_ms: number;
    max_net_usage_words: number;
    ref_block_num: number;
    ref_block_prefix: number;
    signatures: string[];
}
declare class TransactionInfo extends Struct {
    receipt: TransactionReceipt;
    trx: Trx;
}
declare class GetTransactionResponse$1 extends Struct {
    id: Checksum256;
    block_num: UInt32;
    block_time: BlockTimestamp;
    last_irreversible_block: UInt32;
    traces?: TransactionTrace[];
    trx: TransactionInfo;
}
declare class GetKeyAccountsResponse extends Struct {
    account_names: Name[];
}
declare class GetCodeResponse extends Struct {
    abi: ABI.Def;
    account_name: Name;
    code_hash: Checksum256;
    wast: string;
    wasm: string;
}
declare class GetControlledAccountsResponse extends Struct {
    controlled_accounts: Name[];
}
interface GetCurrencyStatsResponse {
    [key: string]: GetCurrencyStatsItemResponse;
}
declare class GetCurrencyStatsItemResponse extends Struct {
    supply: Asset;
    max_supply: Asset;
    issuer: Name;
}
declare class GetTransactionStatusResponse extends Struct {
    state: string;
    head_number: UInt32;
    head_id: BlockId;
    head_timestamp: TimePoint;
    irreversible_number: UInt32;
    irreversible_id: BlockId;
    irreversible_timestamp: TimePoint;
    earliest_tracked_block_id: BlockId;
    earliest_tracked_block_number: UInt32;
}
declare class ProducerAuthority extends Struct {
    threshold: UInt32;
    keys: KeyWeight[];
}
type ProducerEntry = [number, ProducerAuthority];
declare class Producer extends Struct {
    producer_name: Name;
    authority: ProducerEntry;
    static from(data: any): Struct;
}
declare class ProducerSchedule extends Struct {
    version: UInt32;
    producers: Producer[];
}
declare class GetProducerScheduleResponse extends Struct {
    active: ProducerSchedule;
    pending: ProducerSchedule;
    proposed: ProducerSchedule;
}
declare class ProtocolFeature extends Struct {
    feature_digest: Checksum256;
    activation_ordinal: UInt32;
    activation_block_num: UInt32;
    description_digest: Checksum256;
    dependencies: string[];
    protocol_feature_type: string;
    specification: any[];
}
declare class GetProtocolFeaturesResponse extends Struct {
    activated_protocol_features: ProtocolFeature[];
    more: UInt32;
}
interface GetProtocolFeaturesParams {
    /** Lower lookup bound. */
    lower_bound?: UInt32 | number;
    /** Upper lookup bound. */
    upper_bound?: UInt32 | number;
    /** How many rows to fetch, defaults to 10 if unset. */
    limit?: UInt32Type;
    /** Flag to indicate it is has to search by block number */
    search_by_block_num?: boolean;
    /** Whether to iterate records in reverse order. */
    reverse?: boolean;
}
interface GetAccountsByAuthorizersParams {
    accounts?: NameType[];
    keys?: PublicKeyType[];
}

type types$3_AccountByAuthorizersRow = AccountByAuthorizersRow;
declare const types$3_AccountByAuthorizersRow: typeof AccountByAuthorizersRow;
type types$3_AccountLinkedAction = AccountLinkedAction;
declare const types$3_AccountLinkedAction: typeof AccountLinkedAction;
type types$3_AccountObject = AccountObject;
declare const types$3_AccountObject: typeof AccountObject;
type types$3_AccountPermission = AccountPermission;
declare const types$3_AccountPermission: typeof AccountPermission;
type types$3_AccountRefundRequest = AccountRefundRequest;
declare const types$3_AccountRefundRequest: typeof AccountRefundRequest;
type types$3_AccountResourceLimit = AccountResourceLimit;
declare const types$3_AccountResourceLimit: typeof AccountResourceLimit;
type types$3_AccountRexInfo = AccountRexInfo;
declare const types$3_AccountRexInfo: typeof AccountRexInfo;
type types$3_AccountRexInfoMaturities = AccountRexInfoMaturities;
declare const types$3_AccountRexInfoMaturities: typeof AccountRexInfoMaturities;
type types$3_AccountSelfDelegatedBandwidth = AccountSelfDelegatedBandwidth;
declare const types$3_AccountSelfDelegatedBandwidth: typeof AccountSelfDelegatedBandwidth;
type types$3_AccountTotalResources = AccountTotalResources;
declare const types$3_AccountTotalResources: typeof AccountTotalResources;
type types$3_AccountVoterInfo = AccountVoterInfo;
declare const types$3_AccountVoterInfo: typeof AccountVoterInfo;
type types$3_AccountsByAuthorizers = AccountsByAuthorizers;
declare const types$3_AccountsByAuthorizers: typeof AccountsByAuthorizers;
type types$3_ActiveSchedule = ActiveSchedule;
declare const types$3_ActiveSchedule: typeof ActiveSchedule;
type types$3_ActiveScheduleProducer = ActiveScheduleProducer;
declare const types$3_ActiveScheduleProducer: typeof ActiveScheduleProducer;
type types$3_ActiveScheduleProducerAuthority = ActiveScheduleProducerAuthority;
declare const types$3_ActiveScheduleProducerAuthority: typeof ActiveScheduleProducerAuthority;
type types$3_BlockStateHeader = BlockStateHeader;
declare const types$3_BlockStateHeader: typeof BlockStateHeader;
type types$3_GetAbiResponse = GetAbiResponse;
type types$3_GetAccountsByAuthorizersParams = GetAccountsByAuthorizersParams;
type types$3_GetBlockHeaderStateResponse = GetBlockHeaderStateResponse;
declare const types$3_GetBlockHeaderStateResponse: typeof GetBlockHeaderStateResponse;
type types$3_GetBlockInfoResponse = GetBlockInfoResponse;
declare const types$3_GetBlockInfoResponse: typeof GetBlockInfoResponse;
type types$3_GetBlockResponse = GetBlockResponse;
declare const types$3_GetBlockResponse: typeof GetBlockResponse;
type types$3_GetBlockResponseTransactionReceipt = GetBlockResponseTransactionReceipt;
declare const types$3_GetBlockResponseTransactionReceipt: typeof GetBlockResponseTransactionReceipt;
type types$3_GetCodeResponse = GetCodeResponse;
declare const types$3_GetCodeResponse: typeof GetCodeResponse;
type types$3_GetControlledAccountsResponse = GetControlledAccountsResponse;
declare const types$3_GetControlledAccountsResponse: typeof GetControlledAccountsResponse;
type types$3_GetCurrencyStatsItemResponse = GetCurrencyStatsItemResponse;
declare const types$3_GetCurrencyStatsItemResponse: typeof GetCurrencyStatsItemResponse;
type types$3_GetCurrencyStatsResponse = GetCurrencyStatsResponse;
type types$3_GetInfoResponse = GetInfoResponse;
declare const types$3_GetInfoResponse: typeof GetInfoResponse;
type types$3_GetKeyAccountsResponse = GetKeyAccountsResponse;
declare const types$3_GetKeyAccountsResponse: typeof GetKeyAccountsResponse;
type types$3_GetProducerScheduleResponse = GetProducerScheduleResponse;
declare const types$3_GetProducerScheduleResponse: typeof GetProducerScheduleResponse;
type types$3_GetProtocolFeaturesParams = GetProtocolFeaturesParams;
type types$3_GetProtocolFeaturesResponse = GetProtocolFeaturesResponse;
declare const types$3_GetProtocolFeaturesResponse: typeof GetProtocolFeaturesResponse;
type types$3_GetRawAbiResponse = GetRawAbiResponse;
declare const types$3_GetRawAbiResponse: typeof GetRawAbiResponse;
type types$3_GetTableByScopeParams = GetTableByScopeParams;
type types$3_GetTableByScopeResponse = GetTableByScopeResponse;
declare const types$3_GetTableByScopeResponse: typeof GetTableByScopeResponse;
type types$3_GetTableByScopeResponseRow = GetTableByScopeResponseRow;
declare const types$3_GetTableByScopeResponseRow: typeof GetTableByScopeResponseRow;
type types$3_GetTableRowsParams<Index = TableIndexType | string> = GetTableRowsParams<Index>;
type types$3_GetTableRowsParamsKeyed<Index = TableIndexType, Key = keyof TableIndexTypes> = GetTableRowsParamsKeyed<Index, Key>;
type types$3_GetTableRowsParamsTyped<Index = TableIndexType | string, Row = ABISerializableType> = GetTableRowsParamsTyped<Index, Row>;
type types$3_GetTableRowsResponse<Index = TableIndexType, Row = any> = GetTableRowsResponse<Index, Row>;
type types$3_GetTransactionStatusResponse = GetTransactionStatusResponse;
declare const types$3_GetTransactionStatusResponse: typeof GetTransactionStatusResponse;
type types$3_OrderedActionsResult = OrderedActionsResult;
declare const types$3_OrderedActionsResult: typeof OrderedActionsResult;
type types$3_Producer = Producer;
declare const types$3_Producer: typeof Producer;
type types$3_ProducerAuthority = ProducerAuthority;
declare const types$3_ProducerAuthority: typeof ProducerAuthority;
type types$3_ProducerEntry = ProducerEntry;
type types$3_ProducerSchedule = ProducerSchedule;
declare const types$3_ProducerSchedule: typeof ProducerSchedule;
type types$3_ProtocolFeature = ProtocolFeature;
declare const types$3_ProtocolFeature: typeof ProtocolFeature;
type types$3_PushTransactionResponse = PushTransactionResponse;
type types$3_SendTransaction2Options = SendTransaction2Options;
type types$3_SendTransaction2Response = SendTransaction2Response;
type types$3_SendTransactionResponse = SendTransactionResponse;
type types$3_SendTransactionResponseException = SendTransactionResponseException;
type types$3_SendTransactionResponseExceptionStack = SendTransactionResponseExceptionStack;
type types$3_TableIndexType = TableIndexType;
type types$3_TableIndexTypes = TableIndexTypes;
type types$3_TransactionAuthSequence = TransactionAuthSequence;
declare const types$3_TransactionAuthSequence: typeof TransactionAuthSequence;
type types$3_TransactionInfo = TransactionInfo;
declare const types$3_TransactionInfo: typeof TransactionInfo;
type types$3_TransactionTrace = TransactionTrace;
declare const types$3_TransactionTrace: typeof TransactionTrace;
type types$3_TransactionTraceReceipt = TransactionTraceReceipt;
declare const types$3_TransactionTraceReceipt: typeof TransactionTraceReceipt;
type types$3_Trx = Trx;
declare const types$3_Trx: typeof Trx;
declare namespace types$3 {
  export {
    types$3_AccountByAuthorizersRow as AccountByAuthorizersRow,
    types$3_AccountLinkedAction as AccountLinkedAction,
    types$3_AccountObject as AccountObject,
    types$3_AccountPermission as AccountPermission,
    types$3_AccountRefundRequest as AccountRefundRequest,
    types$3_AccountResourceLimit as AccountResourceLimit,
    types$3_AccountRexInfo as AccountRexInfo,
    types$3_AccountRexInfoMaturities as AccountRexInfoMaturities,
    types$3_AccountSelfDelegatedBandwidth as AccountSelfDelegatedBandwidth,
    types$3_AccountTotalResources as AccountTotalResources,
    types$3_AccountVoterInfo as AccountVoterInfo,
    types$3_AccountsByAuthorizers as AccountsByAuthorizers,
    types$3_ActiveSchedule as ActiveSchedule,
    types$3_ActiveScheduleProducer as ActiveScheduleProducer,
    types$3_ActiveScheduleProducerAuthority as ActiveScheduleProducerAuthority,
    BlockExtension$1 as BlockExtension,
    types$3_BlockStateHeader as BlockStateHeader,
    types$3_GetAbiResponse as GetAbiResponse,
    types$3_GetAccountsByAuthorizersParams as GetAccountsByAuthorizersParams,
    GetActionsResponse$1 as GetActionsResponse,
    types$3_GetBlockHeaderStateResponse as GetBlockHeaderStateResponse,
    types$3_GetBlockInfoResponse as GetBlockInfoResponse,
    types$3_GetBlockResponse as GetBlockResponse,
    types$3_GetBlockResponseTransactionReceipt as GetBlockResponseTransactionReceipt,
    types$3_GetCodeResponse as GetCodeResponse,
    types$3_GetControlledAccountsResponse as GetControlledAccountsResponse,
    types$3_GetCurrencyStatsItemResponse as GetCurrencyStatsItemResponse,
    types$3_GetCurrencyStatsResponse as GetCurrencyStatsResponse,
    types$3_GetInfoResponse as GetInfoResponse,
    types$3_GetKeyAccountsResponse as GetKeyAccountsResponse,
    types$3_GetProducerScheduleResponse as GetProducerScheduleResponse,
    types$3_GetProtocolFeaturesParams as GetProtocolFeaturesParams,
    types$3_GetProtocolFeaturesResponse as GetProtocolFeaturesResponse,
    types$3_GetRawAbiResponse as GetRawAbiResponse,
    types$3_GetTableByScopeParams as GetTableByScopeParams,
    types$3_GetTableByScopeResponse as GetTableByScopeResponse,
    types$3_GetTableByScopeResponseRow as GetTableByScopeResponseRow,
    types$3_GetTableRowsParams as GetTableRowsParams,
    types$3_GetTableRowsParamsKeyed as GetTableRowsParamsKeyed,
    types$3_GetTableRowsParamsTyped as GetTableRowsParamsTyped,
    types$3_GetTableRowsResponse as GetTableRowsResponse,
    GetTransactionResponse$1 as GetTransactionResponse,
    types$3_GetTransactionStatusResponse as GetTransactionStatusResponse,
    HeaderExtension$1 as HeaderExtension,
    NewProducers$1 as NewProducers,
    NewProducersEntry$1 as NewProducersEntry,
    types$3_OrderedActionsResult as OrderedActionsResult,
    types$3_Producer as Producer,
    types$3_ProducerAuthority as ProducerAuthority,
    types$3_ProducerEntry as ProducerEntry,
    types$3_ProducerSchedule as ProducerSchedule,
    types$3_ProtocolFeature as ProtocolFeature,
    types$3_PushTransactionResponse as PushTransactionResponse,
    types$3_SendTransaction2Options as SendTransaction2Options,
    types$3_SendTransaction2Response as SendTransaction2Response,
    types$3_SendTransactionResponse as SendTransactionResponse,
    types$3_SendTransactionResponseException as SendTransactionResponseException,
    types$3_SendTransactionResponseExceptionStack as SendTransactionResponseExceptionStack,
    types$3_TableIndexType as TableIndexType,
    types$3_TableIndexTypes as TableIndexTypes,
    types$3_TransactionAuthSequence as TransactionAuthSequence,
    types$3_TransactionInfo as TransactionInfo,
    types$3_TransactionTrace as TransactionTrace,
    types$3_TransactionTraceReceipt as TransactionTraceReceipt,
    types$3_Trx as Trx,
    TrxVariant$1 as TrxVariant,
  };
}

declare class ChainAPI {
    private client;
    constructor(client: APIClient);
    get_abi(accountName: NameType): Promise<GetAbiResponse>;
    get_code(accountName: NameType): Promise<GetCodeResponse>;
    get_raw_abi(accountName: NameType): Promise<GetRawAbiResponse>;
    get_account(accountName: NameType, responseType?: typeof AccountObject): Promise<AccountObject>;
    get_accounts_by_authorizers(params: GetAccountsByAuthorizersParams): Promise<AccountsByAuthorizers>;
    get_activated_protocol_features(params?: GetProtocolFeaturesParams): Promise<GetProtocolFeaturesResponse>;
    get_block(block_num_or_id: BlockIdType | UInt32Type): Promise<GetBlockResponse>;
    get_block_header_state(block_num_or_id: BlockIdType | UInt32Type): Promise<GetBlockHeaderStateResponse>;
    get_block_info(block_num: UInt32Type): Promise<GetBlockInfoResponse>;
    get_currency_balance(contract: NameType, accountName: NameType, symbol?: string): Promise<Asset[]>;
    get_currency_stats(contract: NameType, symbol: string): Promise<GetCurrencyStatsResponse>;
    get_info(): Promise<GetInfoResponse>;
    get_producer_schedule(): Promise<GetProducerScheduleResponse>;
    compute_transaction(tx: SignedTransactionType | PackedTransaction): Promise<SendTransactionResponse>;
    send_read_only_transaction(tx: SignedTransactionType | PackedTransaction): Promise<SendTransactionResponse>;
    push_transaction(tx: SignedTransactionType | PackedTransaction): Promise<PushTransactionResponse>;
    send_transaction(tx: SignedTransactionType | PackedTransaction): Promise<SendTransactionResponse>;
    send_transaction2(tx: SignedTransactionType | PackedTransaction, options?: SendTransaction2Options): Promise<SendTransaction2Response>;
    get_table_rows<Index extends TableIndexType = Name>(params: GetTableRowsParams<Index>): Promise<GetTableRowsResponse<Index>>;
    get_table_rows<Key extends keyof TableIndexTypes>(params: GetTableRowsParamsKeyed<TableIndexTypes[Key], Key>): Promise<GetTableRowsResponse<TableIndexTypes[Key]>>;
    get_table_rows<Row extends ABISerializableConstructor, Index extends TableIndexType = Name>(params: GetTableRowsParamsTyped<Index, Row>): Promise<GetTableRowsResponse<Index, InstanceType<Row>>>;
    get_table_rows<Row extends ABISerializableConstructor, Key extends keyof TableIndexTypes>(params: GetTableRowsParamsTyped<TableIndexTypes[Key], Row> & GetTableRowsParamsKeyed<TableIndexTypes[Key], Key>): Promise<GetTableRowsResponse<TableIndexTypes[Key], InstanceType<Row>>>;
    get_table_by_scope(params: GetTableByScopeParams): Promise<GetTableByScopeResponse>;
    get_transaction_status(id: Checksum256Type): Promise<GetTransactionStatusResponse>;
}

declare class HistoryAPI {
    private client;
    constructor(client: APIClient);
    get_actions(accountName: NameType, pos: Int32Type, offset: Int32Type): Promise<GetActionsResponse$1>;
    get_transaction(id: Checksum256Type, options?: {
        blockNumHint?: UInt32Type;
        excludeTraces?: boolean;
    }): Promise<GetTransactionResponse$1>;
    get_key_accounts(publicKey: PublicKeyType): Promise<GetKeyAccountsResponse>;
    get_controlled_accounts(controllingAccount: NameType): Promise<GetControlledAccountsResponse>;
}

interface HyperionBaseResponse {
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
}
declare class AccountRamDelta extends Struct {
    account: string;
    delta: number;
}
declare class AuthSequence extends Struct {
    account: string;
    sequence: string;
}
declare class Receipt extends Struct {
    receiver: string;
    global_sequence: string;
    recv_sequence: string;
    auth_sequence: AuthSequence[];
}
declare class GetTransactionResponseAction extends Struct {
    action_ordinal: number;
    creator_action_ordinal: number;
    act: AnyAction;
    account_ram_deltas: AccountRamDelta[];
    signatures: Signature[];
    '@timestamp': string;
    block_num: number;
    block_id: string;
    producer: string;
    trx_id: string;
    global_sequence: number;
    cpu_usage_us: number;
    net_usage_words: number;
    code_sequence: number;
    abi_sequence: number;
    act_digest: string;
    receipts: Receipt[];
    timestamp: string;
}
declare class GetTransactionResponse extends Struct {
    query_time_ms: number;
    executed: boolean;
    trx_id: string;
    lib: number;
    cached_lib: boolean;
    actions: GetTransactionResponseAction[];
    last_indexed_block: number;
    last_indexed_block_time: string;
}
declare class ActionDataHeader extends Struct {
    timestamp: number;
    producer: string;
    confirmed: number;
    previous: string;
    transaction_mroot: string;
    action_mroot: string;
    schedule_version: number;
    new_producers?: any;
}
declare class ActionObject extends Struct {
    action_ordinal: number;
    creator_action_ordinal: number;
    act: AnyAction;
    account_ram_deltas: AccountRamDelta[];
    signatures: Signature[];
    '@timestamp': string;
    timestamp: string;
    block_num: number;
    block_id: string;
    trx_id: string;
    receipts: Receipt[];
    cpu_usage_us: number;
    global_sequence: number;
    producer: string;
    net_usage_words: number;
    code_sequence: number;
    abi_sequence: number;
    act_digest: string;
}
declare class GetActionsTotal extends Struct {
    value: number;
    relation: string;
}
declare class GetActionsResponse extends Struct {
    query_time_ms: number;
    cached: boolean;
    lib: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
    total: GetActionsTotal;
    actions: ActionObject[];
}
declare class HealthService extends Struct {
    service: string;
    status: string;
    time: number;
    service_data?: any;
}
declare class HealthFeaturesStreaming extends Struct {
    enable: boolean;
    traces: boolean;
    deltas: boolean;
}
declare class HealthFeaturesTables extends Struct {
    proposals: boolean;
    accounts: boolean;
    voters: boolean;
}
declare class HealthFeatures extends Struct {
    streaming: HealthFeaturesStreaming;
    tables: HealthFeaturesTables;
    index_deltas: boolean;
    index_transfer_memo: boolean;
    index_all_deltas: boolean;
    deferred_trx: boolean;
    failed_trx: boolean;
    resource_limits: boolean;
    resource_usage: boolean;
}
declare class HealthResponse extends Struct implements HyperionBaseResponse {
    version: string;
    version_hash: string;
    host: string;
    health: HealthService[];
    features: HealthFeatures;
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
}
declare class ApiUsageTotal extends Struct {
    responses: Record<string, Record<string, number>>;
}
declare class ApiUsageBucket extends Struct {
    timestamp: string;
    responses: Record<string, Record<string, number>>;
}
declare class ApiUsageResponse extends Struct implements HyperionBaseResponse {
    total: ApiUsageTotal;
    buckets: ApiUsageBucket[];
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
}
declare class MissedBlocksStats extends Struct {
    by_producer: Record<string, number>;
}
declare class MissedBlocksResponse extends Struct implements HyperionBaseResponse {
    stats: MissedBlocksStats;
    events: any[];
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
}
declare class ResourceUsageStats extends Struct {
    count: number;
    min: number | null;
    max: number | null;
    avg: number | null;
    sum: number;
    sum_of_squares: number | null;
    variance: number | null;
    variance_population: number | null;
    variance_sampling: number | null;
    std_deviation: number | null;
    std_deviation_population: number | null;
    std_deviation_sampling: number | null;
    std_deviation_bounds_upper: number | null;
    std_deviation_bounds_lower: number | null;
    std_deviation_bounds_upper_population: number | null;
    std_deviation_bounds_lower_population: number | null;
    std_deviation_bounds_upper_sampling: number | null;
    std_deviation_bounds_lower_sampling: number | null;
}
declare class ResourceUsagePercentiles extends Struct {
    '1.0': number | null;
    '5.0': number | null;
    '25.0': number | null;
    '50.0': number | null;
    '75.0': number | null;
    '95.0': number | null;
    '99.0': number | null;
}
declare class ResourceUsage extends Struct {
    stats: ResourceUsageStats;
    percentiles: ResourceUsagePercentiles;
}
declare class GetResourceUsageResponse extends Struct implements HyperionBaseResponse {
    cpu: ResourceUsage;
    net: ResourceUsage;
    cached: boolean;
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
}
interface GetActionsParams {
    /**
     * Notified account to filter actions.
     */
    account?: string;
    /**
     * Filter actions based on code:name (e.g., `eosio.token:transfer`).
     */
    filter?: string;
    /**
     * Track total results (count). Accepts a number or `true` for total count tracking.
     */
    track?: string | number;
    /**
     * Number of results to skip.
     */
    skip?: number;
    /**
     * Limit the number of results per page.
     */
    limit?: number;
    /**
     * Sort direction for results. Accepts `asc`, `desc`, `1`, or `-1`.
     */
    sort?: 'asc' | 'desc' | '1' | '-1';
    /**
     * Filter actions after the specified date (ISO8601 format).
     */
    after?: string;
    /**
     * Filter actions before the specified date (ISO8601 format).
     */
    before?: string;
    /**
     * Simplified output mode.
     */
    simple?: boolean;
    /**
     * Search only the latest hot index.
     */
    hot_only?: boolean;
    /**
     * Exclude large binary data from the response.
     */
    noBinary?: boolean;
    /**
     * Perform a reversibility check.
     */
    checkLib?: boolean;
}
declare class Permission extends Struct {
    perm_name: string;
    parent: string;
    required_auth: {
        threshold: number;
        keys: {
            key: string;
            weight: number;
        }[];
        accounts: any[];
        waits: any[];
    };
}
declare class Limit extends Struct {
    used: number;
    available: number;
    max: number;
}
declare class TotalResources extends Struct {
    owner: string;
    net_weight: string;
    cpu_weight: string;
    ram_bytes: number;
}
declare class SelfDelegatedBandwidth extends Struct {
    from: string;
    to: string;
    net_weight: string;
    cpu_weight: string;
}
declare class VoterInfo extends Struct {
    owner: string;
    proxy: string;
    producers: string[];
    staked: number;
    last_vote_weight: string;
    proxied_vote_weight: string;
    is_proxy: number;
    flags1: number;
    reserved2: number;
    reserved3: string;
}
declare class Account extends Struct {
    account_name: string;
    head_block_num: number;
    head_block_time: string;
    privileged: boolean;
    last_code_update: string;
    created: string;
    core_liquid_balance: string;
    ram_quota: number;
    net_weight: number;
    cpu_weight: number;
    net_limit: Limit;
    cpu_limit: Limit;
    ram_usage: number;
    permissions: Permission[];
    total_resources: TotalResources;
    self_delegated_bandwidth: SelfDelegatedBandwidth;
    refund_request?: any;
    voter_info: VoterInfo;
    rex_info?: any;
    subjective_cpu_bill_limit: Limit;
}
declare class Link extends Struct {
    timestamp: string;
    permission: string;
    code: string;
    action: string;
}
declare class Token extends Struct {
    symbol: string;
    precision: number;
    amount: number;
    contract: string;
}
declare class Action extends Struct {
    '@timestamp': string;
    timestamp: string;
    block_num: number;
    block_id: string;
    trx_id: string;
    act: any;
    receipts: Receipt[];
    cpu_usage_us: number;
    net_usage_words: number;
    global_sequence: number;
    producer: string;
    action_ordinal: number;
    creator_action_ordinal: number;
    signatures: Signature[];
}
declare class GetAccountResponse extends Struct implements HyperionBaseResponse {
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
    account: Account;
    links: Link[];
    tokens: Token[];
    total_actions: number;
    actions: Action[];
}
interface MissedBlocksParams {
    producer?: NameType;
    after?: string;
    before?: string;
    min_blocks?: number;
}
interface GetResourceUsageParams {
    code: NameType;
    action: NameType;
}
interface GetCreatedAccountsParams {
    /**
     * creator account
     */
    account: NameType;
    /**
     * Number of results to skip.
     */
    skip?: number;
    /**
     * Limit the number of results per page.
     */
    limit?: number;
}
interface CreatedAccount {
    name: string;
    timestamp: string;
    trx_id: string;
}
declare class GetCreatedAccountsResponse extends Struct implements HyperionBaseResponse {
    accounts: CreatedAccount[];
    query_time_ms: number;
    last_indexed_block: number;
    last_indexed_block_time: string;
}

type types$2_Account = Account;
declare const types$2_Account: typeof Account;
type types$2_AccountRamDelta = AccountRamDelta;
declare const types$2_AccountRamDelta: typeof AccountRamDelta;
type types$2_Action = Action;
declare const types$2_Action: typeof Action;
type types$2_ActionDataHeader = ActionDataHeader;
declare const types$2_ActionDataHeader: typeof ActionDataHeader;
type types$2_ActionObject = ActionObject;
declare const types$2_ActionObject: typeof ActionObject;
type types$2_ApiUsageBucket = ApiUsageBucket;
declare const types$2_ApiUsageBucket: typeof ApiUsageBucket;
type types$2_ApiUsageResponse = ApiUsageResponse;
declare const types$2_ApiUsageResponse: typeof ApiUsageResponse;
type types$2_ApiUsageTotal = ApiUsageTotal;
declare const types$2_ApiUsageTotal: typeof ApiUsageTotal;
type types$2_AuthSequence = AuthSequence;
declare const types$2_AuthSequence: typeof AuthSequence;
type types$2_CreatedAccount = CreatedAccount;
type types$2_GetAccountResponse = GetAccountResponse;
declare const types$2_GetAccountResponse: typeof GetAccountResponse;
type types$2_GetActionsParams = GetActionsParams;
type types$2_GetActionsResponse = GetActionsResponse;
declare const types$2_GetActionsResponse: typeof GetActionsResponse;
type types$2_GetActionsTotal = GetActionsTotal;
declare const types$2_GetActionsTotal: typeof GetActionsTotal;
type types$2_GetCreatedAccountsParams = GetCreatedAccountsParams;
type types$2_GetCreatedAccountsResponse = GetCreatedAccountsResponse;
declare const types$2_GetCreatedAccountsResponse: typeof GetCreatedAccountsResponse;
type types$2_GetResourceUsageParams = GetResourceUsageParams;
type types$2_GetResourceUsageResponse = GetResourceUsageResponse;
declare const types$2_GetResourceUsageResponse: typeof GetResourceUsageResponse;
type types$2_GetTransactionResponse = GetTransactionResponse;
declare const types$2_GetTransactionResponse: typeof GetTransactionResponse;
type types$2_GetTransactionResponseAction = GetTransactionResponseAction;
declare const types$2_GetTransactionResponseAction: typeof GetTransactionResponseAction;
type types$2_HealthFeatures = HealthFeatures;
declare const types$2_HealthFeatures: typeof HealthFeatures;
type types$2_HealthFeaturesStreaming = HealthFeaturesStreaming;
declare const types$2_HealthFeaturesStreaming: typeof HealthFeaturesStreaming;
type types$2_HealthFeaturesTables = HealthFeaturesTables;
declare const types$2_HealthFeaturesTables: typeof HealthFeaturesTables;
type types$2_HealthResponse = HealthResponse;
declare const types$2_HealthResponse: typeof HealthResponse;
type types$2_HealthService = HealthService;
declare const types$2_HealthService: typeof HealthService;
type types$2_HyperionBaseResponse = HyperionBaseResponse;
type types$2_Limit = Limit;
declare const types$2_Limit: typeof Limit;
type types$2_Link = Link;
declare const types$2_Link: typeof Link;
type types$2_MissedBlocksParams = MissedBlocksParams;
type types$2_MissedBlocksResponse = MissedBlocksResponse;
declare const types$2_MissedBlocksResponse: typeof MissedBlocksResponse;
type types$2_MissedBlocksStats = MissedBlocksStats;
declare const types$2_MissedBlocksStats: typeof MissedBlocksStats;
type types$2_Permission = Permission;
declare const types$2_Permission: typeof Permission;
type types$2_Receipt = Receipt;
declare const types$2_Receipt: typeof Receipt;
type types$2_ResourceUsage = ResourceUsage;
declare const types$2_ResourceUsage: typeof ResourceUsage;
type types$2_ResourceUsagePercentiles = ResourceUsagePercentiles;
declare const types$2_ResourceUsagePercentiles: typeof ResourceUsagePercentiles;
type types$2_ResourceUsageStats = ResourceUsageStats;
declare const types$2_ResourceUsageStats: typeof ResourceUsageStats;
type types$2_SelfDelegatedBandwidth = SelfDelegatedBandwidth;
declare const types$2_SelfDelegatedBandwidth: typeof SelfDelegatedBandwidth;
type types$2_Token = Token;
declare const types$2_Token: typeof Token;
type types$2_TotalResources = TotalResources;
declare const types$2_TotalResources: typeof TotalResources;
type types$2_VoterInfo = VoterInfo;
declare const types$2_VoterInfo: typeof VoterInfo;
declare namespace types$2 {
  export {
    types$2_Account as Account,
    types$2_AccountRamDelta as AccountRamDelta,
    types$2_Action as Action,
    types$2_ActionDataHeader as ActionDataHeader,
    types$2_ActionObject as ActionObject,
    types$2_ApiUsageBucket as ApiUsageBucket,
    types$2_ApiUsageResponse as ApiUsageResponse,
    types$2_ApiUsageTotal as ApiUsageTotal,
    types$2_AuthSequence as AuthSequence,
    types$2_CreatedAccount as CreatedAccount,
    types$2_GetAccountResponse as GetAccountResponse,
    types$2_GetActionsParams as GetActionsParams,
    types$2_GetActionsResponse as GetActionsResponse,
    types$2_GetActionsTotal as GetActionsTotal,
    types$2_GetCreatedAccountsParams as GetCreatedAccountsParams,
    types$2_GetCreatedAccountsResponse as GetCreatedAccountsResponse,
    types$2_GetResourceUsageParams as GetResourceUsageParams,
    types$2_GetResourceUsageResponse as GetResourceUsageResponse,
    types$2_GetTransactionResponse as GetTransactionResponse,
    types$2_GetTransactionResponseAction as GetTransactionResponseAction,
    types$2_HealthFeatures as HealthFeatures,
    types$2_HealthFeaturesStreaming as HealthFeaturesStreaming,
    types$2_HealthFeaturesTables as HealthFeaturesTables,
    types$2_HealthResponse as HealthResponse,
    types$2_HealthService as HealthService,
    types$2_HyperionBaseResponse as HyperionBaseResponse,
    types$2_Limit as Limit,
    types$2_Link as Link,
    types$2_MissedBlocksParams as MissedBlocksParams,
    types$2_MissedBlocksResponse as MissedBlocksResponse,
    types$2_MissedBlocksStats as MissedBlocksStats,
    types$2_Permission as Permission,
    types$2_Receipt as Receipt,
    types$2_ResourceUsage as ResourceUsage,
    types$2_ResourceUsagePercentiles as ResourceUsagePercentiles,
    types$2_ResourceUsageStats as ResourceUsageStats,
    types$2_SelfDelegatedBandwidth as SelfDelegatedBandwidth,
    types$2_Token as Token,
    types$2_TotalResources as TotalResources,
    types$2_VoterInfo as VoterInfo,
  };
}

declare class HistoryAPIv2 {
    private client;
    constructor(client: APIClient);
    /**
     * Fetch a transaction by ID
     * @param id - Transaction ID
     * @param block_hint - Optional block hint for performance
     */
    get_transaction(id: string, block_hint?: number): Promise<GetTransactionResponse>;
    /**
     * Fetch actions based on specified parameters
     * @param params - Query parameters for fetching actions
     * @returns A promise that resolves to a GetActionsResponse object
     */
    get_actions(params?: GetActionsParams): Promise<GetActionsResponse>;
    /**
     * Fetch all accounts created by a specified account
     * @param params - Query parameters for fetching created accounts
     * @returns A promise that resolves to a GetCreatedAccountsResponse object containing an array of CreatedAccounts
     */
    get_created_accounts(params: GetCreatedAccountsParams): Promise<GetCreatedAccountsResponse>;
}

declare class StateAPIv2 {
    private client;
    constructor(client: APIClient);
    /**
     * Fetch account details by account name
     * @param account - The name of the account to fetch
     * @param limit - Optional limit for pagination
     * @param skip - Optional skip for pagination
     * @returns A promise that resolves to a GetAccountResponse object
     */
    get_account(account: string, limit?: number, skip?: number): Promise<GetAccountResponse>;
}

declare class StatsAPIv2 {
    private client;
    constructor(client: APIClient);
    health(): Promise<HealthResponse>;
    /**
     * Fetch API usage statistics
     * @returns A promise that resolves to an ApiUsageResponse object containing API usage stats
     */
    get_api_usage(): Promise<ApiUsageResponse>;
    /**
     * Fetch missed blocks statistics
     * @param params - Query parameters to filter the missed blocks data
     */
    get_missed_blocks(params?: MissedBlocksParams): Promise<MissedBlocksResponse>;
    /**
     * Fetch resource usage stats for a given contract and action
     * @param params - Query parameters (contract code and action name)
     * @returns A promise that resolves to a GetResourceUsageResponse object
     */
    get_resource_usage(params: GetResourceUsageParams): Promise<GetResourceUsageResponse>;
}

interface APIClientOptions extends FetchProviderOptions {
    /** URL to the API node to use, only used if the provider option is not set. */
    url?: string;
    /** API provider to use, if omitted and the url option is set the default provider will be used.  */
    provider?: APIProvider;
    /** URL specifically for Hyperion API, if available */
    hyperionUrl?: string;
}
interface APIErrorDetail {
    message: string;
    file: string;
    line_number: number;
    method: string;
}
interface APIErrorData {
    code: number;
    name: string;
    what: string;
    details: APIErrorDetail[];
}
type APIMethods = 'POST' | 'GET';
declare class APIError extends Error {
    static __className: string;
    static formatError(error: APIErrorData): string;
    /** The path to the API that failed, e.g. `/v1/chain/get_info`. */
    readonly path: string;
    /** The full response from the API that failed. */
    readonly response: APIResponse;
    constructor(path: string, response: APIResponse);
    /** The nodeop error object. */
    get error(): APIErrorData | undefined;
    /** The nodeop error name, e.g. `tx_net_usage_exceeded` */
    get name(): string;
    /** The nodeop error code, e.g. `3080002`. */
    get code(): number;
    /** List of exceptions, if any. */
    get details(): APIErrorDetail[];
}
declare class APIClient {
    static __className: string;
    readonly v1Provider: APIProvider;
    readonly v2Provider?: APIProvider;
    constructor(options: APIClientOptions);
    v1: {
        chain: ChainAPI;
        history: HistoryAPI;
    };
    v2: {
        history: HistoryAPIv2;
        state: StateAPIv2;
        stats: StatsAPIv2;
    };
    call<T extends ABISerializableConstructor>(args: {
        method?: APIMethods;
        path: string;
        params?: unknown;
        headers?: Record<string, string>;
        responseType: T;
    }): Promise<InstanceType<T>>;
    call<T extends keyof BuiltinTypes>(args: {
        method?: APIMethods;
        path: string;
        params?: unknown;
        headers?: Record<string, string>;
        responseType: T;
    }): Promise<BuiltinTypes[T]>;
    call<T = unknown>(args: {
        method?: APIMethods;
        path: string;
        params?: unknown;
        headers?: Record<string, string>;
    }): Promise<T>;
}

declare namespace types$1 {
  export {
    types$3 as v1,
    types$2 as v2,
  };
}

/**
 * @argument encodedMessage a complete message from the lower transport layer
 */
type P2PDataHandler = (encodedMessage: Uint8Array) => void;
type P2PErrorHandler = (error: any) => void;
type P2PHandler = () => void;
type P2PEventMap = {
    data: P2PDataHandler;
    error: P2PErrorHandler;
    close: P2PHandler;
};
/**
 * Provider interface for P2P protocol responsible for re-assembling full message payloads before
 * delivering them upstream via event emission
 */
interface P2PProvider {
    write(encodedMessage: Uint8Array, done?: P2PHandler): void;
    end(cb?: P2PHandler): void;
    destroy(err?: Error): void;
    on<T extends keyof P2PEventMap>(event: T, handler: P2PEventMap[T]): this;
}
declare class SimpleEnvelopeP2PProvider {
    static maxReadLength: number;
    private nextProvider;
    private dataHandlers;
    private errorHandlers;
    private remainingData;
    constructor(nextProvider: P2PProvider);
    write(data: Uint8Array, done?: P2PHandler): void;
    end(cb?: P2PHandler): void;
    destroy(err?: Error): void;
    on<T extends keyof P2PEventMap>(event: T, handler: P2PEventMap[T]): this;
    emitData(messageBuffer: Uint8Array): void;
    emitError(err: any): void;
}

declare class HandshakeMessage extends Struct {
    networkVersion: UInt16;
    chainId: Checksum256;
    nodeId: Checksum256;
    key: PublicKey;
    time: Int64;
    token: Checksum256;
    sig: Signature;
    p2pAddress: string;
    lastIrreversibleBlockNumber: UInt32;
    lastIrreversibleBlockId: BlockId;
    headNum: UInt32;
    headId: BlockId;
    os: string;
    agent: string;
    generation: Int16;
}
declare class ChainSizeMessage extends Struct {
    lastIrreversibleBlockNumber: UInt32;
    lastIrreversibleBlockId: BlockId;
    headNum: UInt32;
    headId: BlockId;
}
declare class GoAwayMessage extends Struct {
    reason: UInt8;
    nodeId: Checksum256;
}
declare class TimeMessage extends Struct {
    org: Int64;
    rec: Int64;
    xmt: Int64;
    dst: Int64;
}
declare class NoticeMessage extends Struct {
    knownTrx: Checksum256[];
    knownBlocks: BlockId[];
}
declare class RequestMessage extends Struct {
    reqTrx: Checksum256[];
    reqBlocks: BlockId[];
}
declare class SyncRequestMessage extends Struct {
    startBlock: UInt32;
    endBlock: UInt32;
}
declare class NewProducersEntry extends Struct {
    producer_name: Name;
    block_signing_key: PublicKey;
}
declare class NewProducers extends Struct {
    version: UInt32;
    producers: NewProducersEntry;
}
declare class BlockExtension extends Struct {
    type: UInt16;
    data: Bytes;
}
declare class HeaderExtension extends Struct {
    type: UInt16;
    data: Bytes;
}
declare class TrxVariant extends Variant {
    value: Checksum256 | PackedTransaction;
}
declare class FullTransactionReceipt extends Struct {
    status: UInt8;
    cpu_usage_us: UInt32;
    net_usage_words: VarUInt;
    trx: TrxVariant;
}
declare class BlockHeader extends Struct {
    timeSlot: UInt32;
    producer: Name;
    confirmed: UInt16;
    previous: BlockId;
    transaction_mroot: BlockId;
    action_mroot: BlockId;
    schedule_version: UInt32;
    new_producers?: NewProducers;
    header_extensions: HeaderExtension[];
    get blockNum(): UInt32;
    get id(): BlockId;
}
declare class SignedBlock extends BlockHeader {
    producer_signature: Signature;
    transactions: FullTransactionReceipt[];
    block_extensions: BlockExtension[];
}
declare class NetMessage extends Variant {
    value: HandshakeMessage | ChainSizeMessage | GoAwayMessage | TimeMessage | NoticeMessage | RequestMessage | SyncRequestMessage | SignedBlock | PackedTransaction;
}

type types_BlockExtension = BlockExtension;
declare const types_BlockExtension: typeof BlockExtension;
type types_BlockHeader = BlockHeader;
declare const types_BlockHeader: typeof BlockHeader;
type types_ChainSizeMessage = ChainSizeMessage;
declare const types_ChainSizeMessage: typeof ChainSizeMessage;
type types_FullTransactionReceipt = FullTransactionReceipt;
declare const types_FullTransactionReceipt: typeof FullTransactionReceipt;
type types_GoAwayMessage = GoAwayMessage;
declare const types_GoAwayMessage: typeof GoAwayMessage;
type types_HandshakeMessage = HandshakeMessage;
declare const types_HandshakeMessage: typeof HandshakeMessage;
type types_HeaderExtension = HeaderExtension;
declare const types_HeaderExtension: typeof HeaderExtension;
type types_NetMessage = NetMessage;
declare const types_NetMessage: typeof NetMessage;
type types_NewProducers = NewProducers;
declare const types_NewProducers: typeof NewProducers;
type types_NewProducersEntry = NewProducersEntry;
declare const types_NewProducersEntry: typeof NewProducersEntry;
type types_NoticeMessage = NoticeMessage;
declare const types_NoticeMessage: typeof NoticeMessage;
type types_RequestMessage = RequestMessage;
declare const types_RequestMessage: typeof RequestMessage;
type types_SignedBlock = SignedBlock;
declare const types_SignedBlock: typeof SignedBlock;
type types_SyncRequestMessage = SyncRequestMessage;
declare const types_SyncRequestMessage: typeof SyncRequestMessage;
type types_TimeMessage = TimeMessage;
declare const types_TimeMessage: typeof TimeMessage;
declare namespace types {
  export {
    types_BlockExtension as BlockExtension,
    types_BlockHeader as BlockHeader,
    types_ChainSizeMessage as ChainSizeMessage,
    types_FullTransactionReceipt as FullTransactionReceipt,
    types_GoAwayMessage as GoAwayMessage,
    types_HandshakeMessage as HandshakeMessage,
    types_HeaderExtension as HeaderExtension,
    types_NetMessage as NetMessage,
    types_NewProducers as NewProducers,
    types_NewProducersEntry as NewProducersEntry,
    types_NoticeMessage as NoticeMessage,
    types_RequestMessage as RequestMessage,
    types_SignedBlock as SignedBlock,
    types_SyncRequestMessage as SyncRequestMessage,
    types_TimeMessage as TimeMessage,
  };
}

type SetTimeout = (handler: any, timeout: number, ...args: any[]) => number;
interface P2PClientOptions {
    /** P2P provider to use  */
    provider: P2PProvider;
    /** heartbeat timout in milliseconds, or undefined if no heartbeat is desired */
    heartbeatTimoutMs?: number;
    /** alternative implementation for setTimeout (mostly for testing) */
    setTimeoutImpl?: SetTimeout;
}
/**
 * @argument message a decoded message from the lower transport layer
 */
type P2PMessageHandler = (message: NetMessage) => void;
type P2PClientEventMap = {
    message: P2PMessageHandler;
    error: P2PErrorHandler;
    close: P2PHandler;
};
declare class P2PClient {
    static __className: string;
    readonly provider: P2PProvider;
    private setTimeoutImpl;
    private heartbeatTimoutMs?;
    private heartbeatTimoutId?;
    private eventListeners;
    constructor(options: P2PClientOptions);
    send(message: NetMessage['value'], done?: P2PHandler): void;
    end(cb?: P2PHandler): void;
    destroy(err?: Error): void;
    private handleData;
    private endHeartbeat;
    private resetHeartbeat;
    private handleHeartbeat;
    on<T extends keyof P2PClientEventMap>(event: T, handler: P2PClientEventMap[T]): this;
    once<T extends keyof P2PClientEventMap>(event: T, handler: P2PClientEventMap[T]): this;
    addListener<T extends keyof P2PClientEventMap>(event: T, handler: P2PClientEventMap[T]): this;
    prependListener<T extends keyof P2PClientEventMap>(event: T, handler: P2PClientEventMap[T]): this;
    removeListener<T extends keyof P2PClientEventMap>(event: T, handler: P2PClientEventMap[T]): this;
    private addListenerInternal;
    private emit;
}

/**
 * Cancelable promises
 *
 * https://stackoverflow.com/questions/46461801/possible-to-add-a-cancel-method-to-promise-in-typescript/46464377#46464377
 */
declare class Canceled extends Error {
    silent: boolean;
    constructor(reason: any, silent?: boolean);
}
interface Cancelable<T> extends Promise<T> {
    cancel(reason?: string, silent?: boolean): Cancelable<T>;
}
declare function cancelable<T>(promise: Promise<T>, onCancel?: (canceled: Canceled) => void): Cancelable<T>;

declare class ExplorerDefinition extends Struct {
    prefix: string;
    suffix: string;
    url(id: string): string;
}

type Fetch = (input: any, init?: any) => Promise<any>;
type LogoType = Logo | {
    dark: string;
    light: string;
} | string;
type ExplorerDefinitionType = ExplorerDefinition | {
    prefix: string;
    suffix: string;
    url?: (id: string) => string;
};
type ChainDefinitionType = ChainDefinition | {
    id: Checksum256Type;
    url: string;
    explorer?: ExplorerDefinitionType;
    logo?: LogoType;
};
type LocaleDefinitions = Record<string, any>;

declare class Logo extends Struct {
    dark: string;
    light: string;
    static from(data: LogoType): Logo;
    getVariant(variant: 'dark' | 'light'): string | undefined;
    toString(): string;
}

interface ChainDefinitionArgs {
    id: Checksum256Type;
    url: string;
    logo?: LogoType;
    explorer?: ExplorerDefinitionType;
    accountDataType?: typeof AccountObject;
}
/**
 * The information required to interact with a given chain.
 */
declare class ChainDefinition<AccountDataType extends AccountObject = AccountObject> {
    /**
     * The chain ID.
     */
    id: Checksum256;
    /**
     * The base URL of the chain's API endpoint (e.g. https://jungle4.greymass.com).
     */
    url: string;
    /**
     * The absolute URL(s) to the chain's logo.
     */
    logo?: LogoType;
    /**
     * The explorer definition for the chain.
     */
    explorer?: ExplorerDefinitionType;
    /**
     * The account data type for the chain.
     */
    accountDataType?: typeof AccountObject;
    constructor(data: ChainDefinitionArgs);
    static from<AccountDataType extends AccountObject = AccountObject>(data: ChainDefinitionArgs): ChainDefinition<AccountDataType>;
    get name(): string;
    getLogo(): Logo | undefined;
    equals(def: ChainDefinitionType): boolean;
}
/**
 * A list of string-based chain names to assist autocompletion
 */
type ChainIndices = 'EOS' | 'FIO' | 'FIOTestnet' | 'Jungle4' | 'KylinTestnet' | 'Libre' | 'LibreTestnet' | 'Proton' | 'ProtonTestnet' | 'Telos' | 'TelosTestnet' | 'WAX' | 'WAXTestnet' | 'UX';
/**
 * List of human readable chain names based on the ChainIndices type.
 */
declare const ChainNames: Record<ChainIndices, string>;
declare class TelosAccountVoterInfo extends AccountVoterInfo {
    last_stake: Int64;
}
declare class TelosAccountObject extends AccountObject {
    voter_info?: TelosAccountVoterInfo;
}
declare class WAXAccountVoterInfo extends AccountVoterInfo {
    unpaid_voteshare: Float64;
    unpaid_voteshare_last_updated: TimePoint;
    unpaid_voteshare_change_rate: Float64;
    last_claim_time: TimePoint;
}
declare class WAXAccountObject extends AccountObject {
    voter_info?: WAXAccountVoterInfo;
}
/**
 * An exported list of ChainDefinition entries for select chains.
 */
declare namespace Chains {
    const EOS: ChainDefinition<AccountObject>;
    const FIO: ChainDefinition<AccountObject>;
    const FIOTestnet: ChainDefinition<AccountObject>;
    const Jungle4: ChainDefinition<AccountObject>;
    const KylinTestnet: ChainDefinition<AccountObject>;
    const Libre: ChainDefinition<AccountObject>;
    const LibreTestnet: ChainDefinition<AccountObject>;
    const Proton: ChainDefinition<AccountObject>;
    const ProtonTestnet: ChainDefinition<AccountObject>;
    const Telos: ChainDefinition<TelosAccountObject>;
    const TelosTestnet: ChainDefinition<TelosAccountObject>;
    const WAX: ChainDefinition<WAXAccountObject>;
    const WAXTestnet: ChainDefinition<WAXAccountObject>;
    const UX: ChainDefinition<AccountObject>;
}
/**
 * A list of chain IDs and their ChainIndices for reference lookups
 */
declare const chainIdsToIndices: Map<Checksum256Type, ChainIndices>;
/**
 * A list of known chain IDs and their logos.
 */
declare const chainLogos: Map<Checksum256Type, LogoType>;

interface PowerUpStateOptions {
    timestamp?: TimePointType;
    virtual_block_cpu_limit?: UInt64;
    virtual_block_net_limit?: UInt64;
}

declare abstract class PowerUpStateResource extends Struct {
    version: UInt8;
    weight: Int64;
    weight_ratio: Int64;
    assumed_stake_weight: Int64;
    initial_weight_ratio: Int64;
    target_weight_ratio: Int64;
    initial_timestamp: TimePointSec;
    target_timestamp: TimePointSec;
    exponent: Float64;
    decay_secs: UInt32;
    min_price: Asset;
    max_price: Asset;
    utilization: Int64;
    adjusted_utilization: Int64;
    utilization_timestamp: TimePointSec;
    readonly default_block_cpu_limit: UInt64;
    readonly default_block_net_limit: UInt64;
    abstract per_day(options?: PowerUpStateOptions): number;
    get allocated(): number;
    get reserved(): BN;
    get symbol(): Asset.Symbol;
    cast(): {
        adjusted_utilization: number;
        decay_secs: number;
        exponent: number;
        utilization: number;
        utilization_timestamp: number;
        weight: BN;
        weight_ratio: number;
    };
    utilization_increase(sample: UInt128, frac: any): number;
    price_function(utilization: number): number;
    price_integral_delta(start_utilization: number, end_utilization: number): number;
    fee(utilization_increase: any, adjusted_utilization: any): number;
    determine_adjusted_utilization(options?: PowerUpStateOptions): number;
}

declare class PowerUpStateResourceCPU extends PowerUpStateResource {
    per_day: (options?: PowerUpStateOptions) => number;
    ms_per_day(options?: PowerUpStateOptions): number;
    us_per_day(options?: PowerUpStateOptions): number;
    weight_to_us(sample: UInt128, weight: number): number;
    us_to_weight(sample: UInt128, us: number): number;
    frac: (usage: SampleUsage, us: number) => number;
    frac_by_ms: (usage: SampleUsage, ms: number) => number;
    frac_by_us(usage: SampleUsage, us: number): number;
    price_per: (usage: SampleUsage, us?: number, options?: PowerUpStateOptions) => number;
    price_per_ms: (usage: SampleUsage, ms?: number, options?: PowerUpStateOptions) => number;
    price_per_us(usage: SampleUsage, us?: number, options?: PowerUpStateOptions): number;
}

declare class PowerUpStateResourceNET extends PowerUpStateResource {
    per_day: (options?: PowerUpStateOptions) => number;
    kb_per_day(options?: PowerUpStateOptions): number;
    bytes_per_day(options?: PowerUpStateOptions): number;
    weight_to_bytes(sample: UInt128, weight: number): number;
    bytes_to_weight(sample: UInt128, bytes: number): number;
    frac: (usage: SampleUsage, bytes: number) => number;
    frac_by_kb: (usage: SampleUsage, kilobytes: number) => number;
    frac_by_bytes(usage: SampleUsage, bytes: number): number;
    price_per: (usage: SampleUsage, bytes?: number, options?: PowerUpStateOptions) => number;
    price_per_kb: (usage: SampleUsage, kilobytes?: number, options?: PowerUpStateOptions) => number;
    price_per_byte(usage: SampleUsage, bytes?: number, options?: PowerUpStateOptions): number;
}

declare class PowerUpState extends Struct {
    version: UInt8;
    net: PowerUpStateResourceNET;
    cpu: PowerUpStateResourceCPU;
    powerup_days: UInt32;
    min_powerup_fee: Asset;
}
declare class PowerUpAPI {
    private parent;
    constructor(parent: Resources);
    get_state(): Promise<PowerUpState>;
}

declare class Connector extends Struct {
    balance: Asset;
    weight: Float64;
}
declare class ExchangeState extends Struct {
    supply: Asset;
    base: Connector;
    quote: Connector;
}
declare class RAMState extends ExchangeState {
    price_per(bytes: number): Asset;
    price_per_kb(kilobytes: number): Asset;
    get_input(base: Int64, quote: Int64, value: Int64): Int64;
}
declare class RAMAPI {
    private parent;
    constructor(parent: Resources);
    get_state(): Promise<RAMState>;
}

declare class REXState extends Struct {
    version: UInt8;
    total_lent: Asset;
    total_unlent: Asset;
    total_rent: Asset;
    total_lendable: Asset;
    total_rex: Asset;
    namebid_proceeds: Asset;
    loan_num: UInt64;
    get reserved(): number;
    get symbol(): Asset.Symbol;
    get precision(): number;
    get value(): number;
    exchange(amount: Asset): Asset;
    price_per(sample: SampleUsage, unit?: number): number;
}
declare class REXAPI {
    private parent;
    constructor(parent: Resources);
    get_state(): Promise<REXState>;
}

interface ResourcesOptions extends APIClientOptions {
    api?: APIClient;
    sampleAccount?: string;
    symbol?: string;
    url?: string;
}
interface SampleUsage {
    account: AccountObject;
    cpu: UInt128;
    net: UInt128;
}
declare const BNPrecision: BN;
declare class Resources {
    static __className: string;
    readonly api: APIClient;
    sampleAccount: string;
    symbol: string;
    constructor(options: ResourcesOptions);
    v1: {
        powerup: PowerUpAPI;
        ram: RAMAPI;
        rex: REXAPI;
    };
    getSampledUsage(): Promise<SampleUsage>;
}

/**
 * Get curve for key type.
 * @internal
 */
declare function getCurve(type: string): ec;

/** Chain ID aliases. */
declare enum ChainName {
    UNKNOWN = 0,
    EOS = 1,
    TELOS = 2,
    JUNGLE = 3,
    KYLIN = 4,
    WORBLI = 5,
    BOS = 6,
    MEETONE = 7,
    INSIGHTS = 8,
    BEOS = 9,
    WAX = 10,
    PROTON = 11,
    FIO = 12
}
type ChainIdType = ChainId | ChainName | Checksum256Type;
declare class ChainId extends Checksum256 {
    static from(value: ChainIdType): ChainId;
    get chainVariant(): ChainIdVariant;
    get chainName(): ChainName;
}
declare class ChainAlias extends UInt8 {
}
declare class ChainIdVariant extends Variant {
    value: ChainId | ChainAlias;
    get chainId(): ChainId;
}

/** SigningRequest ABI and typedefs. */

declare class AccountName extends Name {
}
declare class PermissionName extends Name {
}
declare class IdentityV2 extends Struct {
    permission?: PermissionLevel;
}
declare class IdentityV3 extends Struct {
    scope: Name;
    permission?: PermissionLevel;
}
declare class RequestVariantV2 extends Variant {
    value: Action$1 | Action$1[] | Transaction | IdentityV2;
}
declare class RequestVariantV3 extends Variant {
    value: Action$1 | Action$1[] | Transaction | IdentityV3;
}
declare class RequestFlags extends UInt8 {
    static broadcast: number;
    static background: number;
    get broadcast(): boolean;
    set broadcast(enabled: boolean);
    get background(): boolean;
    set background(enabled: boolean);
    private setFlag;
}
declare class InfoPair extends Struct {
    key: string;
    value: Bytes;
}
declare class RequestDataV2 extends Struct {
    chain_id: ChainIdVariant;
    req: RequestVariantV2;
    flags: RequestFlags;
    callback: string;
    info: InfoPair[];
}
declare class RequestDataV3 extends Struct {
    chain_id: ChainIdVariant;
    req: RequestVariantV3;
    flags: RequestFlags;
    callback: string;
    info: InfoPair[];
}
declare class RequestSignature extends Struct {
    signer: Name;
    signature: Signature;
}

/**
 * SYSIO Signing Request (SSR).
 */

/** Current supported protocol version, backwards compatible with version 2. */
declare const ProtocolVersion = 3;
/** Interface that should be implemented by abi providers. */
interface AbiProvider {
    /**
     * Return a promise that resolves to an abi object for the given account name,
     * e.g. the result of a rpc call to chain/get_abi.
     */
    getAbi: (account: Name) => Promise<ABIDef>;
}
/** Interface that should be implemented by zlib implementations. */
interface ZlibProvider {
    /** Deflate data w/o adding zlib header. */
    deflateRaw: (data: Uint8Array) => Uint8Array;
    /** Inflate data w/o requiring zlib header. */
    inflateRaw: (data: Uint8Array) => Uint8Array;
}
/** Interface that should be implemented by signature providers. */
interface SignatureProvider {
    /** Sign 32-byte message and return signer name and signature string. */
    sign: (message: Checksum256) => {
        signer: NameType;
        signature: SignatureType;
    };
}
/**
 * The callback payload sent to background callbacks.
 */
interface CallbackPayload {
    /** The first signature. */
    sig: string;
    /** Transaction ID as HEX-encoded string. */
    tx: string;
    /** Block number hint (only present if transaction was broadcast). */
    bn?: string;
    /** Signer authority, aka account name. */
    sa: string;
    /** Signer permission, e.g. "active". */
    sp: string;
    /** Reference block num used when resolving request. */
    rbn: string;
    /** Reference block id used when resolving request. */
    rid: string;
    /** The originating signing request packed as a uri string. */
    req: string;
    /** Expiration time used when resolving request. */
    ex: string;
    /** The resolved chain id.  */
    cid?: string;
    /** All signatures 0-indexed as `sig0`, `sig1`, etc. */
    [sig0: string]: string | undefined;
}
/**
 * Context used to resolve a callback.
 * Compatible with the JSON response from a `push_transaction` call.
 */
interface ResolvedCallback {
    /** The URL to hit. */
    url: string;
    /**
     * Whether to run the request in the background. For a https url this
     * means POST in the background instead of a GET redirect.
     */
    background: boolean;
    /**
     * The callback payload as a object that should be encoded to JSON
     * and POSTed to background callbacks.
     */
    payload: CallbackPayload;
}
/**
 * Context used to resolve a transaction.
 * Compatible with the JSON response from a `get_block` call.
 */
interface TransactionContext {
    /** Timestamp expiration will be derived from. */
    timestamp?: TimePointType;
    /**
     * How many seconds in the future to set expiration when deriving from timestamp.
     * Defaults to 60 seconds if unset.
     */
    expire_seconds?: UInt32Type;
    /** Block number ref_block_num will be derived from. */
    block_num?: UInt32Type;
    /** Reference block number, takes precedence over block_num if both is set. */
    ref_block_num?: UInt16Type;
    /** Reference block prefix. */
    ref_block_prefix?: UInt32Type;
    /** Expiration timestamp, takes precedence over timestamp and expire_seconds if set. */
    expiration?: TimePointType;
    /** Chain ID to resolve for, required for multi-chain requests. */
    chainId?: ChainIdType;
}
/**
 * The placeholder name: `............1` aka `uint64(1)`.
 * If used in action data will be resolved to current signer.
 * If used in as an authorization permission will be resolved to
 * the signers permission level.
 *
 * Example action:
 * ```
 * { account: "eosio.token",
 *   name: "transfer",
 *   authorization: [{actor: "............1", permission: "............1"}],
 *   data: {
 *     from: "............1",
 *     to: "bar",
 *     quantity: "42.0000 EOS",
 *     memo: "Don't panic" }}
 * ```
 * When signed by `foo@active` would resolve to:
 * ```
 * { account: "eosio.token",
 *   name: "transfer",
 *   authorization: [{actor: "foo", permission: "active"}],
 *   data: {
 *     from: "foo",
 *     to: "bar",
 *     quantity: "42.0000 EOS",
 *     memo: "Don't panic" }}
 * ```
 */
declare const PlaceholderName: Name;
/** Placeholder that will resolve to signer permission name. */
declare const PlaceholderPermission: Name;
declare const PlaceholderAuth: PermissionLevel;
interface ResolvedAction {
    /** The account (a.k.a. contract) to run action on. */
    account: Name;
    /** The name of the action. */
    name: Name;
    /** The permissions authorizing the action. */
    authorization: PermissionLevel[];
    /** The decoded action data. */
    data: Record<string, ABISerializable>;
}
interface ResolvedTransaction {
    /** The time at which a transaction expires. */
    expiration: TimePointSec;
    /** *Specifies a block num in the last 2^16 blocks. */
    ref_block_num: UInt16;
    /** Specifies the lower 32 bits of the block id. */
    ref_block_prefix: UInt32;
    /** Upper limit on total network bandwidth (in 8 byte words) billed for this transaction. */
    max_net_usage_words: VarUInt;
    /** Upper limit on the total CPU time billed for this transaction. */
    max_cpu_usage_ms: UInt8;
    /** Number of seconds to delay this transaction for during which it may be canceled. */
    delay_sec: VarUInt;
    /** The context free actions in the transaction. */
    context_free_actions: ResolvedAction[];
    /** The actions in the transaction. */
    actions: ResolvedAction[];
    /** Transaction extensions. */
    transaction_extensions: TransactionExtension[];
}
type CallbackType = string | {
    url: string;
    background: boolean;
};
interface SigningRequestCommonArguments {
    /**
     * Chain ID to use, can be set to `null` for a multi-chain request.
     * Defaults to EOS if omitted.
     */
    chainId?: ChainIdType | null;
    /**
     * Chain IDs to constrain a multi-chain request to.
     * Only considered if `chainId` is explicitly set to `null.
     */
    chainIds?: ChainIdType[];
    /** Optional metadata to pass along with the request. */
    info?: {
        [key: string]: Bytes | ABISerializable;
    };
}
interface SigningRequestCreateArguments extends SigningRequestCommonArguments {
    /** Single action to create request with. */
    action?: AnyAction;
    /** Multiple actions to create request with. */
    actions?: AnyAction[];
    /**
     * Full or partial transaction to create request with.
     * If TAPoS info is omitted it will be filled in when resolving the request.
     */
    transaction?: Partial<AnyTransaction>;
    /** Create an identity request. */
    identity?: {
        scope?: NameType;
        permission?: PermissionLevelType;
    };
    /** Whether wallet should broadcast tx, defaults to true. */
    broadcast?: boolean;
    /**
     * Optional callback URL the signer should hit after
     * broadcasting or signing. Passing a string means background = false.
     */
    callback?: CallbackType;
}
interface SigningRequestCreateIdentityArguments extends SigningRequestCommonArguments {
    /**
     * Callback where the identity should be delivered.
     */
    callback: CallbackType;
    /**
     * Requested account name of identity.
     * Defaults to placeholder (any identity) if omitted.
     */
    account?: NameType;
    /**
     * Requested account permission.
     * Defaults to placeholder (any permission) if omitted.
     */
    permission?: NameType;
    /**
     * Scope for the request.
     */
    scope?: NameType;
}
interface SigningRequestEncodingOptions {
    /** Optional zlib, if provided the request will be compressed when encoding. */
    zlib?: ZlibProvider;
    /** Abi provider, required if the arguments contain un-encoded actions. */
    abiProvider?: AbiProvider;
    /** Optional signature provider, will be used to create a request signature if provided. */
    signatureProvider?: SignatureProvider;
}
type AbiMap = Map<string, ABI>;
declare class SigningRequest {
    /** Return the identity ABI for given version. */
    private static identityAbi;
    /** Return the ABISerializableType identity type for given version. */
    private static identityType;
    /** Return the ABISerializableType storage type for given version. */
    private static storageType;
    /** Create a new signing request. */
    static create(args: SigningRequestCreateArguments, options?: SigningRequestEncodingOptions): Promise<SigningRequest>;
    /**
     * Synchronously create a new signing request.
     * @throws If an un-encoded action with no abi def is encountered.
     */
    static createSync(args: SigningRequestCreateArguments, options?: SigningRequestEncodingOptions, abis?: Record<string, ABIDef>): SigningRequest;
    /** Creates an identity request. */
    static identity(args: SigningRequestCreateIdentityArguments, options?: SigningRequestEncodingOptions): SigningRequest;
    /**
     * Create a request from a chain id and serialized transaction.
     * @param chainId The chain id where the transaction is valid.
     * @param serializedTransaction The serialized transaction.
     * @param options Creation options.
     */
    static fromTransaction(chainId: ChainIdType, serializedTransaction: BytesType, options?: SigningRequestEncodingOptions): SigningRequest;
    /** Creates a signing request from encoded `esr:` uri string. */
    static from(uri: string, options?: SigningRequestEncodingOptions): SigningRequest;
    static fromData(data: BytesType, options?: SigningRequestEncodingOptions): SigningRequest;
    /** The signing request version. */
    version: number;
    /** The raw signing request data. */
    data: RequestDataV2 | RequestDataV3;
    /** The request signature. */
    signature?: RequestSignature;
    private zlib?;
    private abiProvider?;
    /**
     * Create a new signing request.
     * Normally not used directly, see the `create` and `from` class methods.
     */
    constructor(version: number, data: RequestDataV2 | RequestDataV3, zlib?: ZlibProvider, abiProvider?: AbiProvider, signature?: RequestSignature);
    /**
     * Sign the request, mutating.
     * @param signatureProvider The signature provider that provides a signature for the signer.
     */
    sign(signatureProvider: SignatureProvider): void;
    /**
     * Get the signature digest for this request.
     */
    getSignatureDigest(): Checksum256;
    /**
     * Set the signature data for this request, mutating.
     * @param signer Account name of signer.
     * @param signature The signature string.
     */
    setSignature(signer: string, signature: string): void;
    /**
     * Set the request callback, mutating.
     * @param url Where the callback should be sent.
     * @param background Whether the callback should be sent in the background.
     */
    setCallback(url: string, background: boolean): void;
    /**
     * Set broadcast flag.
     * @param broadcast Whether the transaction should be broadcast by receiver.
     */
    setBroadcast(broadcast: boolean): void;
    /**
     * Encode this request into an `esr:` uri.
     * @argument compress Whether to compress the request data using zlib,
     *                    defaults to true if omitted and zlib is present;
     *                    otherwise false.
     * @argument slashes Whether add slashes after the protocol scheme, i.e. `esr://`.
     *                   Defaults to true.
     * @returns An esr uri string.
     */
    encode(compress?: boolean, slashes?: boolean, scheme?: string): string;
    /** Get the request data without header or signature. */
    getData(): Uint8Array;
    /** Get signature data, returns an empty array if request is not signed. */
    getSignatureData(): Uint8Array;
    /** ABI definitions required to resolve request. */
    getRequiredAbis(): Name[];
    /** Whether TaPoS values are required to resolve request. */
    requiresTapos(): boolean;
    /** Resolve required ABI definitions. */
    fetchAbis(abiProvider?: AbiProvider): Promise<AbiMap>;
    /**
     * Decode raw actions actions to object representations.
     * @param abis ABI defenitions required to decode all actions.
     * @param signer Placeholders in actions will be resolved to signer if set.
     */
    resolveActions(abis: AbiMap, signer?: PermissionLevelType): ResolvedAction[];
    resolveTransaction(abis: AbiMap, signer: PermissionLevelType, ctx?: TransactionContext): ResolvedTransaction;
    resolve(abis: AbiMap, signer: PermissionLevelType, ctx?: TransactionContext): ResolvedSigningRequest;
    /**
     * Get the id of the chain where this request is valid.
     * @returns The 32-byte chain id as hex encoded string.
     */
    getChainId(): ChainId;
    /**
     * Chain IDs this request is valid for, only valid for multi chain requests. Value of `null` when `isMultiChain` is true denotes any chain.
     */
    getChainIds(): ChainId[] | null;
    /**
     * Set chain IDs this request is valid for, only considered for multi chain requests.
     */
    setChainIds(ids: ChainIdType[]): void;
    /**
     * True if chainId is set to chain alias `0` which indicates that the request is valid for any chain.
     */
    isMultiChain(): boolean;
    /** Return the actions in this request with action data encoded. */
    getRawActions(): Action$1[];
    /** Unresolved transaction. */
    getRawTransaction(): Transaction;
    /** Whether the request is an identity request. */
    isIdentity(): boolean;
    /** Whether the request should be broadcast by signer. */
    shouldBroadcast(): boolean;
    /**
     * Present if the request is an identity request and requests a specific account.
     * @note This returns `nil` unless a specific identity has been requested,
     *       use `isIdentity` to check id requests.
     */
    getIdentity(): Name | null;
    /**
     * Present if the request is an identity request and requests a specific permission.
     * @note This returns `nil` unless a specific permission has been requested,
     *       use `isIdentity` to check id requests.
     */
    getIdentityPermission(): Name | null;
    /**
     * Present if the request is an identity request and requests a specific permission.
     * @note This returns `nil` unless a specific permission has been requested,
     *       use `isIdentity` to check id requests.
     */
    getIdentityScope(): Name | null;
    /** Get raw info dict */
    getRawInfo(): {
        [key: string]: Bytes;
    };
    getRawInfoKey(key: string): Bytes | undefined;
    setRawInfoKey(key: string, value: BytesType): void;
    /** Set a metadata key. */
    setInfoKey(key: string, object: ABISerializable, type?: ABISerializableType): void;
    /** Get a metadata key. */
    getInfoKey(key: string): string;
    getInfoKey<T extends ABISerializableConstructor>(key: string, type: T): InstanceType<T>;
    getInfoKey(key: string, type: ABISerializableType): any;
    /** Return a deep copy of this request. */
    clone(): SigningRequest;
    toString(): string;
    toJSON(): string;
}
declare class ResolvedSigningRequest {
    /** Recreate a resolved request from a callback payload. */
    static fromPayload(payload: CallbackPayload, options?: SigningRequestEncodingOptions): Promise<ResolvedSigningRequest>;
    /** The request that created the transaction. */
    readonly request: SigningRequest;
    /** Expected signer of transaction. */
    readonly signer: PermissionLevel;
    /** Transaction object with action data encoded. */
    readonly transaction: Transaction;
    /** Transaction object with action data decoded. */
    readonly resolvedTransaction: ResolvedTransaction;
    /** Id of chain where the request was resolved. */
    readonly chainId: ChainId;
    constructor(request: SigningRequest, signer: PermissionLevel, transaction: Transaction, resolvedTransaction: ResolvedTransaction, chainId: ChainId);
    get serializedTransaction(): Uint8Array;
    get signingDigest(): Checksum256;
    get signingData(): Bytes;
    getCallback(signatures: SignatureType[], blockNum?: UInt32Type): ResolvedCallback | null;
    getIdentityProof(signature: SignatureType): IdentityProof;
}
/**
 * IDENTITY PROOF ts
 */
type IdentityProofType = IdentityProof | string | {
    chainId: ChainIdType;
    scope: NameType;
    expiration: TimePointType;
    signer: PermissionLevelType;
    signature: SignatureType;
};
declare class IdentityProof extends Struct {
    chainId: ChainId;
    scope: Name;
    expiration: TimePointSec;
    signer: PermissionLevel;
    signature: Signature;
    static from(value: IdentityProofType): IdentityProof;
    /**
     * Create a new instance from an SYSIO authorization header string.
     * "SYSIO <base64payload>"
     */
    static fromString(string: string): IdentityProof;
    /** Create a new instance from a callback payload. */
    static fromPayload(payload: CallbackPayload, options?: SigningRequestEncodingOptions): IdentityProof;
    /**
     * Transaction this proof resolves to.
     * @internal
     */
    get transaction(): Transaction;
    /**
     * Recover the public key that signed this proof.
     */
    recover(): PublicKey;
    /**
     * Verify that given authority signed this proof.
     * @param auth The accounts signing authority.
     * @param currentTime Time to verify expiry against, if unset will use system time.
     */
    verify(auth: AuthorityType, currentTime?: TimePointType): boolean;
    /**
     * Encode the proof to an `SYSIO` auth header string.
     */
    toString(): string;
}

/**
 * Base64u - URL-Safe Base64 variant no padding.
 * Based on https://gist.github.com/jonleighton/958841
 */
declare function encode(data: Uint8Array, urlSafe?: boolean): string;
declare function decode(input: string): Uint8Array;

declare const base64u_decode: typeof decode;
declare const base64u_encode: typeof encode;
declare namespace base64u {
  export {
    base64u_decode as decode,
    base64u_encode as encode,
  };
}

interface ABICacheInterface extends AbiProvider {
    readonly cache: Map<string, ABI>;
    readonly pending: Map<string, Promise<GetRawAbiResponse>>;
    getAbi(account: NameType): Promise<ABI>;
    setAbi(account: NameType, abi: ABIDef, merge?: boolean): void;
}
/**
 * Given an APIClient instance, this class provides an AbiProvider interface for retrieving and caching ABIs.
 */
declare class ABICache implements ABICacheInterface {
    readonly client: APIClient;
    readonly cache: Map<string, ABI>;
    readonly pending: Map<string, Promise<GetRawAbiResponse>>;
    constructor(client: APIClient);
    getAbi(account: NameType): Promise<ABI>;
    setAbi(account: NameType, abiDef: ABIDef, merge?: boolean): void;
}

export { ABI, ABICache, ABICacheInterface, ABIDecoder, ABIDef, ABIEncoder, ABISerializable, ABISerializableConstructor, ABISerializableObject, ABISerializableType, types$1 as API, APIClient, APIClientOptions, APIError, APIErrorData, APIErrorDetail, APIMethods, APIProvider, APIResponse, AbiMap, AbiProvider, AccountName, Action$1 as Action, ActionFields, ActionType, AnyAction, AnyInt, AnyTransaction, AnyVariant, Asset, AssetType, Authority, AuthorityType, BNPrecision, Base58, base64u as Base64u, Blob, BlobType, BlockId, BlockIdType, BlockTimestamp, Bytes, BytesEncoding, BytesType, CallbackPayload, CallbackType, Cancelable, Canceled, ChainAPI, ChainAlias, ChainDefinition, ChainDefinitionArgs, ChainDefinitionType, ChainId, ChainIdType, ChainIdVariant, ChainIndices, ChainName, ChainNames, Chains, Checksum160, Checksum160Type, Checksum256, Checksum256Type, Checksum512, Checksum512Type, CompressionType, Connector, DivisionBehavior, ExchangeState, ExplorerDefinition, ExplorerDefinitionType, ExtendedAsset, ExtendedAssetType, ExtendedSymbol, ExtendedSymbolType, Fetch, FetchProvider, FetchProviderOptions, Float128, Float128Type, Float32, Float32Type, Float64, Float64Type, HistoryAPI, IdentityProof, IdentityProofType, IdentityV2, IdentityV3, InfoPair, Int, Int128, Int128Type, Int16, Int16Type, Int32, Int32Type, Int64, Int64Type, Int8, Int8Type, KeyType, KeyWeight, LocaleDefinitions, Logo, LogoType, Name, NameType, OverflowBehavior, types as P2P, P2PClient, P2PClientOptions, P2PDataHandler, P2PErrorHandler, P2PEventMap, P2PHandler, P2PMessageHandler, P2PProvider, PackedTransaction, PackedTransactionType, PermissionLevel, PermissionLevelType, PermissionLevelWeight, PermissionName, PlaceholderAuth, PlaceholderName, PlaceholderPermission, PowerUpAPI, PowerUpState, PrivateKey, PrivateKeyType, ProtocolVersion, PublicKey, PublicKeyType, RAMAPI, RAMState, REXAPI, REXState, RequestDataV2, RequestDataV3, RequestFlags, RequestSignature, RequestVariantV2, RequestVariantV3, ResolvedAction, ResolvedCallback, ResolvedSigningRequest, ResolvedTransaction, Resources, SampleUsage, Serializer, Signature, SignatureProvider, SignatureType, SignedTransaction, SignedTransactionFields, SignedTransactionType, SigningRequest, SigningRequestCreateArguments, SigningRequestCreateIdentityArguments, SigningRequestEncodingOptions, SimpleEnvelopeP2PProvider, Struct, StructConstructor, TelosAccountObject, TelosAccountVoterInfo, TimePoint, TimePointSec, TimePointType, Transaction, TransactionContext, TransactionExtension, TransactionFields, TransactionHeader, TransactionHeaderFields, TransactionHeaderType, TransactionReceipt, TransactionType, TypeAlias, UInt128, UInt128Type, UInt16, UInt16Type, UInt256, UInt256Parts, UInt256Type, UInt32, UInt32Type, UInt64, UInt64Type, UInt8, UInt8Type, VarInt, VarIntType, VarUInt, VarUIntType, Variant, VariantConstructor, WAXAccountObject, WAXAccountVoterInfo, WaitWeight, Weight, ZlibProvider, arrayEquals, arrayEquatableEquals, arrayToHex, cancelable, chainIdsToIndices, chainLogos, getCurve, hexToArray, isInstanceOf, secureRandom };
