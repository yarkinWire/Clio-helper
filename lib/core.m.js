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
import rand from 'brorand';
import { sha256, sha512, ripemd160 } from 'hash.js';
import BN from 'bn.js';
import { ec } from 'elliptic';
import { __decorate } from 'tslib';
import pako from 'pako';
import bigDecimal from 'js-big-decimal';

function arrayEquals(a, b) {
    const len = a.length;
    if (len !== b.length) {
        return false;
    }
    for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
function arrayEquatableEquals(a, b) {
    const len = a.length;
    if (len !== b.length) {
        return false;
    }
    for (let i = 0; i < len; i++) {
        if (!a[i].equals(b[i])) {
            return false;
        }
    }
    return true;
}
const hexLookup = {};
function buildHexLookup() {
    hexLookup.enc = new Array(0xff);
    hexLookup.dec = {};
    for (let i = 0; i <= 0xff; ++i) {
        const b = i.toString(16).padStart(2, '0');
        hexLookup.enc[i] = b;
        hexLookup.dec[b] = i;
    }
}
function arrayToHex(array) {
    if (!hexLookup.enc) {
        buildHexLookup();
    }
    const len = array.length;
    const rv = new Array(len);
    for (let i = 0; i < len; ++i) {
        rv[i] = hexLookup.enc[array[i]];
    }
    return rv.join('');
}
function hexToArray(hex) {
    if (!hexLookup.dec) {
        buildHexLookup();
    }
    if (typeof hex !== 'string') {
        throw new Error('Expected string containing hex digits');
    }
    if (hex.length % 2) {
        throw new Error('Odd number of hex digits');
    }
    hex = hex.toLowerCase();
    const len = hex.length / 2;
    const result = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        const b = hexLookup.dec[hex[i * 2] + hex[i * 2 + 1]];
        if (b === undefined) {
            throw new Error('Expected hex string');
        }
        result[i] = b;
    }
    return result;
}
/** Generate N random bytes, throws if a secure random source isn't available. */
function secureRandom(length) {
    return rand(length);
}
/** Used in isInstanceOf checks so we don't spam with warnings. */
let didWarn = false;
/** Check if object in instance of class. */
function isInstanceOf(object, someClass) {
    if (object instanceof someClass) {
        return true;
    }
    if (object == null || typeof object !== 'object') {
        return false;
    }
    // not an actual instance but since bundlers can fail to dedupe stuff or
    // multiple versions can be included we check for compatibility if possible
    const className = someClass['__className'] || someClass['abiName'];
    if (!className) {
        return false;
    }
    let instanceClass = object.constructor;
    let isAlienInstance = false;
    while (instanceClass && !isAlienInstance) {
        const instanceClassName = instanceClass['__className'] || instanceClass['abiName'];
        if (!instanceClassName) {
            break;
        }
        isAlienInstance = className == instanceClassName;
        instanceClass = Object.getPrototypeOf(instanceClass);
    }
    if (isAlienInstance && !didWarn) {
        // eslint-disable-next-line no-console
        console.warn(`Detected alien instance of ${className}, this usually means more than one version of @wireio/core has been included in your bundle.`);
        didWarn = true;
    }
    return isAlienInstance;
}

class Blob {
    /**
     * Create a new Blob instance.
     */
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (typeof value === 'string') {
            return this.fromString(value);
        }
        throw new Error('Invalid blob');
    }
    static fromString(value) {
        // If buffer is available, use it (maintains support for nodejs 14)
        if (typeof Buffer === 'function') {
            return new this(new Uint8Array(Buffer.from(value, 'base64')));
        }
        // fix up base64 padding from nodeop
        switch (value.length % 4) {
            case 2:
                value += '==';
                break;
            case 3:
                value += '=';
                break;
            case 1:
                value = value.substring(0, value.length - 1);
                break;
        }
        const string = atob(value);
        const array = new Uint8Array(string.length);
        for (let i = 0; i < string.length; i++) {
            array[i] = string.charCodeAt(i);
        }
        return new this(array);
    }
    constructor(array) {
        this.array = array;
    }
    equals(other) {
        const self = this.constructor;
        try {
            return arrayEquals(this.array, self.from(other).array);
        }
        catch {
            return false;
        }
    }
    get base64String() {
        // If buffer is available, use it (maintains support for nodejs 14)
        if (typeof Buffer === 'function') {
            return Buffer.from(this.array).toString('base64');
        }
        return btoa(this.utf8String);
    }
    /** UTF-8 string representation of this instance. */
    get utf8String() {
        return new TextDecoder().decode(this.array);
    }
    toABI(encoder) {
        encoder.writeArray(this.array);
    }
    toString() {
        return this.base64String;
    }
    toJSON() {
        return this.toString();
    }
}
Blob.abiName = 'blob';

class Bytes {
    /**
     * Create a new Bytes instance.
     * @note Make sure to take a [[copy]] before mutating the bytes as the underlying source is not copied here.
     */
    static from(value, encoding) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (typeof value === 'string') {
            return this.fromString(value, encoding);
        }
        if (ArrayBuffer.isView(value)) {
            return new this(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
        }
        if (isInstanceOf(value['array'], Uint8Array)) {
            return new this(value['array']);
        }
        return new this(new Uint8Array(value));
    }
    static fromString(value, encoding = 'hex') {
        if (encoding === 'hex') {
            const array = hexToArray(value);
            return new this(array);
        }
        else if (encoding == 'utf8') {
            const encoder = new TextEncoder();
            return new this(encoder.encode(value));
        }
        else {
            throw new Error(`Unknown encoding: ${encoding}`);
        }
    }
    static fromABI(decoder) {
        const len = decoder.readVaruint32();
        return new this(decoder.readArray(len));
    }
    static abiDefault() {
        return new Bytes();
    }
    static equal(a, b) {
        return this.from(a).equals(this.from(b));
    }
    static random(length) {
        return new this(secureRandom(length));
    }
    /** Return true if given value is a valid `BytesType`. */
    static isBytes(value) {
        if (isInstanceOf(value, Bytes) || isInstanceOf(value, Uint8Array)) {
            return true;
        }
        if (Array.isArray(value) && value.every((v) => typeof v === 'number')) {
            return true;
        }
        if (typeof value === 'string' && (/[\da-f]/i.test(value) || value === '')) {
            return true;
        }
        return false;
    }
    constructor(array = new Uint8Array()) {
        this.array = array;
    }
    /** Number of bytes in this instance. */
    get length() {
        return this.array.byteLength;
    }
    /** Hex string representation of this instance. */
    get hexString() {
        return arrayToHex(this.array);
    }
    /** UTF-8 string representation of this instance. */
    get utf8String() {
        return new TextDecoder().decode(this.array);
    }
    /** Mutating. Append bytes to this instance. */
    append(other) {
        other = Bytes.from(other);
        const newSize = this.array.byteLength + other.array.byteLength;
        const buffer = new ArrayBuffer(newSize);
        const array = new Uint8Array(buffer);
        array.set(this.array);
        array.set(other.array, this.array.byteLength);
        this.array = array;
    }
    /** Non-mutating, returns a copy of this instance with appended bytes. */
    appending(other) {
        const rv = new Bytes(this.array);
        rv.append(other);
        return rv;
    }
    /** Mutating. Pad this instance to length. */
    zeropad(n, truncate = false) {
        const newSize = truncate ? n : Math.max(n, this.array.byteLength);
        const buffer = new ArrayBuffer(newSize);
        const array = new Uint8Array(buffer);
        array.fill(0);
        if (truncate && this.array.byteLength > newSize) {
            array.set(this.array.slice(0, newSize), 0);
        }
        else {
            array.set(this.array, newSize - this.array.byteLength);
        }
        this.array = array;
    }
    /** Non-mutating, returns a copy of this instance with zeros padded. */
    zeropadded(n, truncate = false) {
        const rv = new Bytes(this.array);
        rv.zeropad(n, truncate);
        return rv;
    }
    /** Mutating. Drop bytes from the start of this instance. */
    dropFirst(n = 1) {
        this.array = this.array.subarray(n);
    }
    /** Non-mutating, returns a copy of this instance with dropped bytes from the start. */
    droppingFirst(n = 1) {
        return new Bytes(this.array.subarray(n));
    }
    copy() {
        const buffer = new ArrayBuffer(this.array.byteLength);
        const array = new Uint8Array(buffer);
        array.set(this.array);
        return new Bytes(array);
    }
    equals(other) {
        return arrayEquals(this.array, Bytes.from(other).array);
    }
    toString(encoding = 'hex') {
        if (encoding === 'hex') {
            return this.hexString;
        }
        else if (encoding === 'utf8') {
            return this.utf8String;
        }
        else {
            throw new Error(`Unknown encoding: ${encoding}`);
        }
    }
    toABI(encoder) {
        encoder.writeVaruint32(this.array.byteLength);
        encoder.writeArray(this.array);
    }
    toJSON() {
        return this.hexString;
    }
}
Bytes.abiName = 'bytes';

class Checksum {
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (isInstanceOf(value, Checksum)) {
            return new this(value.array);
        }
        return new this(Bytes.from(value).array);
    }
    static fromABI(decoder) {
        return new this(decoder.readArray(this.byteSize));
    }
    static abiDefault() {
        return new this(new Uint8Array(this.byteSize));
    }
    constructor(array) {
        const byteSize = this.constructor.byteSize;
        if (array.byteLength !== byteSize) {
            throw new Error(`Checksum size mismatch, expected ${byteSize} bytes got ${array.byteLength}`);
        }
        this.array = array;
    }
    equals(other) {
        const self = this.constructor;
        try {
            return arrayEquals(this.array, self.from(other).array);
        }
        catch {
            return false;
        }
    }
    get hexString() {
        return arrayToHex(this.array);
    }
    toABI(encoder) {
        encoder.writeArray(this.array);
    }
    toString() {
        return this.hexString;
    }
    toJSON() {
        return this.toString();
    }
}
Checksum.abiName = '__checksum';
class Checksum256 extends Checksum {
    static from(value) {
        return super.from(value);
    }
    static hash(data) {
        const digest = new Uint8Array(sha256().update(Bytes.from(data).array).digest());
        return new Checksum256(digest);
    }
}
Checksum256.abiName = 'checksum256';
Checksum256.byteSize = 32;
class Checksum512 extends Checksum {
    static from(value) {
        return super.from(value);
    }
    static hash(data) {
        const digest = new Uint8Array(sha512().update(Bytes.from(data).array).digest());
        return new Checksum512(digest);
    }
}
Checksum512.abiName = 'checksum512';
Checksum512.byteSize = 64;
class Checksum160 extends Checksum {
    static from(value) {
        return super.from(value);
    }
    static hash(data) {
        const digest = new Uint8Array(ripemd160().update(Bytes.from(data).array).digest());
        return new Checksum160(digest);
    }
}
Checksum160.abiName = 'checksum160';
Checksum160.byteSize = 20;

/** Supported Wire curve types. */
var KeyType;
(function (KeyType) {
    KeyType["K1"] = "K1";
    KeyType["R1"] = "R1";
    KeyType["WA"] = "WA";
    KeyType["EM"] = "EM";
})(KeyType || (KeyType = {}));
(function (KeyType) {
    function indexFor(value) {
        switch (value) {
            case KeyType.K1:
                return 0;
            case KeyType.R1:
                return 1;
            case KeyType.WA:
                return 2;
            case KeyType.EM:
                return 3;
            default:
                throw new Error(`Unknown curve type: ${value}`);
        }
    }
    KeyType.indexFor = indexFor;
    function from(value) {
        let index;
        if (typeof value !== 'number') {
            index = KeyType.indexFor(value);
        }
        else {
            index = value;
        }
        switch (index) {
            case 0:
                return KeyType.K1;
            case 1:
                return KeyType.R1;
            case 2:
                return KeyType.WA;
            case 3:
                return KeyType.EM;
            default:
                throw new Error('Unknown curve type');
        }
    }
    KeyType.from = from;
})(KeyType || (KeyType = {}));

/**
 * Binary integer with the underlying value represented by a BN.js instance.
 * Follows C++11 standard for arithmetic operators and conversions.
 * @note This type is optimized for correctness not speed, if you plan to manipulate
 *       integers in a tight loop you're advised to use the underlying BN.js value or
 *       convert to a JavaScript number first.
 */
class Int {
    /** Largest value that can be represented by this integer type. */
    static get max() {
        return new BN(2).pow(new BN(this.byteWidth * 8 - (this.isSigned ? 1 : 0))).isubn(1);
    }
    /** Smallest value that can be represented by this integer type. */
    static get min() {
        return this.isSigned ? this.max.ineg().isubn(1) : new BN(0);
    }
    /** Add `lhs` to `rhs` and return the resulting value. */
    static add(lhs, rhs, overflow = 'truncate') {
        return Int.operator(lhs, rhs, overflow, (a, b) => a.add(b));
    }
    /** Add `lhs` to `rhs` and return the resulting value. */
    static sub(lhs, rhs, overflow) {
        return Int.operator(lhs, rhs, overflow, (a, b) => a.sub(b));
    }
    /** Multiply `lhs` by `rhs` and return the resulting value. */
    static mul(lhs, rhs, overflow) {
        return Int.operator(lhs, rhs, overflow, (a, b) => a.mul(b));
    }
    /**
     * Divide `lhs` by `rhs` and return the quotient, dropping the remainder.
     * @throws When dividing by zero.
     */
    static div(lhs, rhs, overflow) {
        return Int.operator(lhs, rhs, overflow, (a, b) => {
            if (b.isZero()) {
                throw new Error('Division by zero');
            }
            return a.div(b);
        });
    }
    /**
     * Divide `lhs` by `rhs` and return the quotient + remainder rounded to the closest integer.
     * @throws When dividing by zero.
     */
    static divRound(lhs, rhs, overflow) {
        return Int.operator(lhs, rhs, overflow, (a, b) => {
            if (b.isZero()) {
                throw new Error('Division by zero');
            }
            return a.divRound(b);
        });
    }
    /**
     * Divide `lhs` by `rhs` and return the quotient + remainder rounded up to the closest integer.
     * @throws When dividing by zero.
     */
    static divCeil(lhs, rhs, overflow) {
        return Int.operator(lhs, rhs, overflow, (a, b) => {
            if (b.isZero()) {
                throw new Error('Division by zero');
            }
            const dm = a.divmod(b);
            if (dm.mod.isZero())
                return dm.div;
            return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
        });
    }
    /** Compare `lhs` to `rhs` and return true if `lhs` is greater than `rhs`. */
    static gt(lhs, rhs) {
        return lhs.value.gt(rhs.value);
    }
    /** Compare `lhs` to `rhs` and return true if `lhs` is less than `rhs`. */
    static lt(lhs, rhs) {
        return lhs.value.lt(rhs.value);
    }
    /** Compare `lhs` to `rhs` and return true if `lhs` is greater than or equal to `rhs`. */
    static gte(lhs, rhs) {
        return lhs.value.gte(rhs.value);
    }
    /** Compare `lhs` to `rhs` and return true if `lhs` is less than or equal to `rhs`. */
    static lte(lhs, rhs) {
        return lhs.value.lte(rhs.value);
    }
    /**
     * Can be used to implement custom operator.
     * @internal
     */
    static operator(lhs, rhs, overflow = 'truncate', fn) {
        const { a, b } = convert(lhs, rhs);
        const type = a.constructor;
        const result = fn(a.value, b.value);
        return type.from(result, overflow);
    }
    static from(value, overflow) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        let fromType = this;
        let bn;
        if (isInstanceOf(value, Int)) {
            fromType = value.constructor;
            bn = value.value.clone();
        }
        else if (value instanceof Uint8Array) {
            bn = new BN(value, undefined, 'le');
            if (fromType.isSigned) {
                bn = bn.fromTwos(fromType.byteWidth * 8);
            }
        }
        else {
            if ((typeof value === 'string' && !/[0-9]+/.test(value)) ||
                (typeof value === 'number' && !Number.isFinite(value))) {
                throw new Error('Invalid number');
            }
            bn = BN.isBN(value) ? value.clone() : new BN(value, 10);
            if (bn.isNeg() && !fromType.isSigned) {
                fromType = { byteWidth: fromType.byteWidth, isSigned: true };
            }
        }
        switch (overflow) {
            case 'clamp':
                bn = clamp(bn, this.min, this.max);
                break;
            case 'truncate':
                bn = truncate(bn, fromType, this);
                break;
        }
        return new this(bn);
    }
    static fromABI(decoder) {
        return this.from(decoder.readArray(this.byteWidth));
    }
    static abiDefault() {
        return this.from(0);
    }
    static random() {
        return this.from(secureRandom(this.byteWidth));
    }
    /**
     * Create a new instance, don't use this directly. Use the `.from` factory method instead.
     * @throws If the value over- or under-flows the integer type.
     */
    constructor(value) {
        const self = this.constructor;
        if (self.isSigned === undefined || self.byteWidth === undefined) {
            throw new Error('Cannot instantiate abstract class Int');
        }
        if (value.gt(self.max)) {
            throw new Error(`Number ${value} overflows ${self.abiName}`);
        }
        if (value.lt(self.min)) {
            throw new Error(`Number ${value} underflows ${self.abiName}`);
        }
        this.value = value;
    }
    cast(type, overflow = 'truncate') {
        if (this.constructor === type) {
            return this;
        }
        return type.from(this, overflow);
    }
    /** Number as bytes in little endian (matches memory layout in C++ contract). */
    get byteArray() {
        const self = this.constructor;
        const value = self.isSigned ? this.value.toTwos(self.byteWidth * 8) : this.value;
        return value.toArrayLike(Uint8Array, 'le', self.byteWidth);
    }
    /**
     * Compare two integers, if strict is set to true the test will only consider integers
     * of the exact same type. I.e. Int64.from(1).equals(UInt64.from(1)) will return false.
     */
    equals(other, strict = false) {
        const self = this.constructor;
        if (strict === true && isInstanceOf(other, Int)) {
            const otherType = other.constructor;
            if (self.byteWidth !== otherType.byteWidth || self.isSigned !== otherType.isSigned) {
                return false;
            }
        }
        try {
            return this.value.eq(self.from(other).value);
        }
        catch {
            return false;
        }
    }
    /** Mutating add. */
    add(num) {
        this.value = this.operator(num, Int.add).value;
    }
    /** Non-mutating add. */
    adding(num) {
        return this.operator(num, Int.add);
    }
    /** Mutating subtract. */
    subtract(num) {
        this.value = this.operator(num, Int.sub).value;
    }
    /** Non-mutating subtract. */
    subtracting(num) {
        return this.operator(num, Int.sub);
    }
    /** Mutating multiply. */
    multiply(by) {
        this.value = this.operator(by, Int.mul).value;
    }
    /** Non-mutating multiply. */
    multiplying(by) {
        return this.operator(by, Int.mul);
    }
    /**
     * Mutating divide.
     * @param behavior How to handle the remainder, default is to floor (round down).
     * @throws When dividing by zero.
     */
    divide(by, behavior) {
        this.value = this.dividing(by, behavior).value;
    }
    /**
     * Non-mutating divide.
     * @param behavior How to handle the remainder, default is to floor (round down).
     * @throws When dividing by zero.
     */
    dividing(by, behavior) {
        let op = Int.div;
        switch (behavior) {
            case 'ceil':
                op = Int.divCeil;
                break;
            case 'round':
                op = Int.divRound;
                break;
        }
        return this.operator(by, op);
    }
    /** Greater than comparision operator */
    gt(other) {
        return Int.gt(this, other);
    }
    /** Less than comparision operator */
    lt(other) {
        return Int.lt(this, other);
    }
    /** Greater than or equal comparision operator */
    gte(other) {
        return Int.gte(this, other);
    }
    /** Less than or equal comparision operator */
    lte(other) {
        return Int.lte(this, other);
    }
    /**
     * Run operator with C++11 implicit conversion.
     * @internal
     */
    operator(other, fn) {
        let rhs;
        if (isInstanceOf(other, Int)) {
            rhs = other;
        }
        else {
            rhs = Int64.from(other, 'truncate');
        }
        return fn(this, rhs).cast(this.constructor);
    }
    /**
     * Convert to a JavaScript number.
     * @throws If the number cannot be represented by 53-bits.
     **/
    toNumber() {
        return this.value.toNumber();
    }
    toString() {
        return this.value.toString();
    }
    [Symbol.toPrimitive](type) {
        if (type === 'number') {
            return this.toNumber();
        }
        else {
            return this.toString();
        }
    }
    toABI(encoder) {
        encoder.writeArray(this.byteArray);
    }
    toJSON() {
        // match FCs behavior and return strings for anything above 32-bit
        if (this.value.bitLength() > 32) {
            return this.value.toString();
        }
        else {
            return this.value.toNumber();
        }
    }
}
Int.abiName = '__int';
class Int8 extends Int {
}
Int8.abiName = 'int8';
Int8.byteWidth = 1;
Int8.isSigned = true;
class Int16 extends Int {
}
Int16.abiName = 'int16';
Int16.byteWidth = 2;
Int16.isSigned = true;
class Int32 extends Int {
}
Int32.abiName = 'int32';
Int32.byteWidth = 4;
Int32.isSigned = true;
class Int64 extends Int {
}
Int64.abiName = 'int64';
Int64.byteWidth = 8;
Int64.isSigned = true;
class Int128 extends Int {
}
Int128.abiName = 'int128';
Int128.byteWidth = 16;
Int128.isSigned = true;
class UInt8 extends Int {
}
UInt8.abiName = 'uint8';
UInt8.byteWidth = 1;
UInt8.isSigned = false;
class UInt16 extends Int {
}
UInt16.abiName = 'uint16';
UInt16.byteWidth = 2;
UInt16.isSigned = false;
class UInt32 extends Int {
}
UInt32.abiName = 'uint32';
UInt32.byteWidth = 4;
UInt32.isSigned = false;
class UInt64 extends Int {
}
UInt64.abiName = 'uint64';
UInt64.byteWidth = 8;
UInt64.isSigned = false;
class UInt128 extends Int {
}
UInt128.abiName = 'uint128';
UInt128.byteWidth = 16;
UInt128.isSigned = false;
// Struct to match the 256-bit integer in Wire C++ Core contract
class UInt256 {
    constructor(low, high) {
        this.low = low;
        this.high = high;
    }
    /**
     * Create a UInt256 from a number, string, or UInt128 instance.
     * Interprets all values as 18-decimal fixed-point.
     */
    static from(value) {
        // Convert incoming to a decimal string
        const valueStr = value.toString();
        const [whole, frac = ""] = valueStr.split(".");
        const wholePart = new BN(whole || "0", 10).mul(this.SCALE);
        const fracPartStr = frac.padEnd(this.DECIMALS, "0").slice(0, this.DECIMALS);
        const fractionalPart = new BN(fracPartStr, 10);
        // Combine into one scaled BN
        const scaled = wholePart.add(fractionalPart);
        // Check 2^256 overflow
        if (scaled.gt(this.MAX_UINT256)) {
            throw new Error(`Value ${value} exceeds 256 bits once scaled`);
        }
        // Now split into low/high 128 bits
        const mask128 = new BN("ffffffffffffffffffffffffffffffff", 16); // 128 bits
        const lowBN = scaled.and(mask128);
        const highBN = scaled.shrn(128);
        return new UInt256(UInt128.from(lowBN), UInt128.from(highBN));
    }
    /**
     * Rereate a UInt256 class from its low and high parts as js numbers
     * Useful when creating UInt256 from the value stored in a smart contract
     */
    static recreate(value) {
        return new UInt256(UInt128.from(value.low), UInt128.from(value.high));
    }
    /**
     * Construct a UInt256 from a raw 256-bit BN (no scaling).
     * Internal helper for add/sub/mul/div.
     */
    static fromRaw(raw) {
        if (raw.isNeg()) {
            throw new Error("Cannot represent negative values in UInt256");
        }
        if (raw.gt(this.MAX_UINT256)) {
            throw new Error("Uint256 overflow (larger than 2^256 - 1)");
        }
        const mask128 = new BN("ffffffffffffffffffffffffffffffff", 16);
        const lowBN = raw.and(mask128);
        const highBN = raw.shrn(128);
        return new UInt256(UInt128.from(lowBN), UInt128.from(highBN));
    }
    /**
     * Helper to combine `low` + `high` into a single BN that includes the
     * _already-scaled_ 10^18 factor.
     */
    raw() {
        const lowBN = UInt256.u128ToBN(this.low);
        const highBN = UInt256.u128ToBN(this.high).shln(128);
        return highBN.add(lowBN);
    }
    /**
     * Convert the UInt256 to a human-readable string,
     * e.g. "123.456" for internal BN "123456000000000000000".
     */
    toString() {
        const scaled = this.raw();
        const intPart = scaled.div(UInt256.SCALE);
        const fracPart = scaled.mod(UInt256.SCALE);
        if (fracPart.isZero()) {
            // No fractional digits
            return intPart.toString(10);
        }
        else {
            // We have a fractional component
            const fracStr = fracPart
                .toString(10)
                .padStart(UInt256.DECIMALS, "0")
                .replace(/0+$/, ""); // remove trailing zeros
            return `${intPart}.${fracStr}`;
        }
    }
    /**
     * Convert the UInt256 to a JS number if safe; otherwise returns a BN.
     * This "descale" by 10^18 first, so "123.456" comes back as ~123.456 in JS.
     */
    toNumber() {
        const scaled = this.raw(); // The big BN, e.g. 123.456 => 123456000000000000
        const integer = scaled.div(UInt256.SCALE);
        const remainder = scaled.mod(UInt256.SCALE);
        // 1) If the integer part alone exceeds 2^53, return BN (or throw)
        if (integer.bitLength() > 53) {
            return new BN(this.toString());
        }
        // 2) Convert integer part safely
        const intNum = integer.toNumber(); // Guaranteed safe
        // 3) If no remainder, we have a whole number (like 123.000...)
        if (remainder.isZero()) {
            return intNum;
        }
        // 4) We have a fractional part. Instead of remainder.toNumber(),
        //    convert remainder to decimal string, pad left to 18 digits,
        //    then parse as float in '0.xxxxx' form.
        const remainderStr = remainder.toString(10).padStart(UInt256.DECIMALS, '0');
        // e.g. "456000000000000000" => parseFloat("0.456000000000000000") => ~0.456
        // parseFloat of an 18-digit fraction is near the limit of JS float precision,
        // but it won't throw an error. You will get a float ~0.456
        const fracNum = parseFloat('0.' + remainderStr);
        // 5) Combine integer + fraction. If that sum is still <= 2^53,
        //    we return it; otherwise, return BN. 
        const result = intNum + fracNum;
        if (!Number.isFinite(result) || result > Number.MAX_SAFE_INTEGER) {
            return new BN(this.toString());
        }
        return result;
    }
    /**
     * Add another UInt256 (both 18-decimal scaled).
     */
    add(other) {
        const sum = this.raw().add(other.raw());
        return UInt256.fromRaw(sum);
    }
    /**
     * Subtract another UInt256. Throws if result < 0 (underflow).
     */
    subtract(other) {
        const diff = this.raw().sub(other.raw());
        if (diff.isNeg()) {
            throw new Error("Underflow in subtract");
        }
        return UInt256.fromRaw(diff);
    }
    /**
     * Multiply this UInt256 by another, then scale back down by 10^18
     * so final is still 18-decimals.
     *
     * So effectively: (a * b) / 10^18
     */
    multiply(other) {
        const product = this.raw().mul(other.raw()).div(UInt256.SCALE);
        return UInt256.fromRaw(product);
    }
    /**
     * Divide this UInt256 by another, scaling up the dividend by 10^18
     * first so final is still 18 decimals.
     *
     * So effectively: (a * 10^18) / b
     */
    divide(divisor) {
        const b = divisor.raw();
        if (b.isZero()) {
            throw new Error('Division by zero');
        }
        const numerator = this.raw().mul(UInt256.SCALE);
        const quotient = numerator.div(b);
        return UInt256.fromRaw(quotient);
    }
    /**
     * Modulo. Because both sides are scaled, we just do raw mod.
     * The result is still scaled with 18 decimals.
     */
    modulo(divisor) {
        const b = divisor.raw();
        if (b.isZero()) {
            throw new Error('Division by zero in modulo');
        }
        const remainder = this.raw().mod(b);
        return UInt256.fromRaw(remainder);
    }
    /**
     * Compare: -1 if this < other, 0 if equal, +1 if this > other.
     */
    compare(other) {
        const aRaw = this.raw();
        const bRaw = other.raw();
        return aRaw.cmp(bRaw);
    }
    equals(other) {
        return this.compare(other) === 0;
    }
    greaterThan(other) {
        return this.compare(other) > 0;
    }
    lessThan(other) {
        return this.compare(other) < 0;
    }
    static u128ToBN(u128) {
        // Access the raw bytes in LE
        const bytes = u128.byteArray;
        return new BN(bytes, 'le');
    }
}
UInt256.abiName = 'uint256';
UInt256.byteWidth = 32;
UInt256.isSigned = false;
UInt256.DECIMALS = 18;
UInt256.SCALE = new BN(10).pow(new BN(UInt256.DECIMALS));
UInt256.MAX_UINT256 = new BN(1).shln(256).isubn(1); // 2^256 - 1
class VarInt extends Int {
    static fromABI(decoder) {
        return new this(new BN(decoder.readVarint32()));
    }
    toABI(encoder) {
        encoder.writeVarint32(Number(this));
    }
}
VarInt.abiName = 'varint32';
VarInt.byteWidth = 32;
VarInt.isSigned = true;
class VarUInt extends Int {
    static fromABI(decoder) {
        return new this(new BN(decoder.readVaruint32()));
    }
    toABI(encoder) {
        encoder.writeVaruint32(Number(this));
    }
}
VarUInt.abiName = 'varuint32';
VarUInt.byteWidth = 32;
VarUInt.isSigned = false;
/** Clamp number between min and max. */
function clamp(num, min, max) {
    return BN.min(BN.max(num, min), max);
}
/**
 * Create new BN with the same bit pattern as the passed value,
 * extending or truncating the value’s representation as necessary.
 */
function truncate(value, from, to) {
    const fill = value.isNeg() ? 255 : 0;
    const fromValue = from.isSigned ? value.toTwos(from.byteWidth * 8) : value;
    const fromBytes = fromValue.toArrayLike(Uint8Array, 'le');
    const toBytes = new Uint8Array(to.byteWidth);
    toBytes.fill(fill);
    toBytes.set(fromBytes.slice(0, to.byteWidth));
    const toValue = new BN(toBytes, undefined, 'le');
    return to.isSigned ? toValue.fromTwos(to.byteWidth * 8) : toValue;
}
/** C++11 implicit integer conversions. */
function convert(a, b) {
    // The integral promotions (4.5) shall be performed on both operands.
    a = promote(a);
    b = promote(b);
    const aType = a.constructor;
    const bType = b.constructor;
    // If both operands have the same type, no further conversion is needed
    if (aType !== bType) {
        // Otherwise, if both operands have signed integer types or both have unsigned integer types,
        // the operand with the type of lesser integer conversion rank shall be converted to the type
        // of the operand with greater rank.
        if (aType.isSigned === bType.isSigned) {
            if (aType.byteWidth > bType.byteWidth) {
                b = b.cast(aType);
            }
            else if (bType.byteWidth > aType.byteWidth) {
                a = a.cast(bType);
            }
        }
        else {
            // Otherwise, if the operand that has unsigned integer type has rank greater than or equal
            // to the rank of the type of the other operand, the operand with signed integer type
            // shall be converted to the type of the operand with unsigned integer type.
            if (aType.isSigned === false && aType.byteWidth >= bType.byteWidth) {
                b = b.cast(aType);
            }
            else if (bType.isSigned === false && bType.byteWidth >= aType.byteWidth) {
                a = a.cast(bType);
            }
            else {
                // Otherwise, if the type of the operand with signed integer type can represent all of the
                // values of the type of the operand with unsigned integer type, the operand with unsigned
                // integer type shall be converted to the type of the operand with signed integer type.
                if (aType.isSigned === true &&
                    aType.max.gte(bType.max) &&
                    aType.min.lte(bType.min)) {
                    b = b.cast(aType);
                }
                else if (bType.isSigned === true &&
                    bType.max.gte(aType.max) &&
                    bType.min.lte(aType.min)) {
                    a = a.cast(bType);
                }
                else ;
            }
        }
    }
    return { a, b };
}
/** C++11 integral promotion. */
function promote(n) {
    // An rvalue of type char, signed char, unsigned char, short int, or
    // unsigned short int can be converted to an rvalue of type int if int
    // can represent all the values of the source type; otherwise, the source
    // rvalue can be converted to an rvalue of type unsigned int.
    let rv = n;
    const type = n.constructor;
    if (type.byteWidth < 4) {
        rv = n.cast(Int32);
    }
    return rv;
}

/** Return a ABI definition for given ABISerializableType. */
function synthesizeABI(type) {
    const structs = [];
    const variants = [];
    const aliases = [];
    const seen = new Set();
    const resolveAbiType = (t) => {
        let typeName;
        if (typeof t.type !== 'string') {
            typeName = resolve(t.type);
        }
        else {
            typeName = t.type;
        }
        if (t.array === true) {
            typeName += '[]';
        }
        if (t.optional === true) {
            typeName += '?';
        }
        if (t.extension === true) {
            typeName += '$';
        }
        return typeName;
    };
    const resolve = (t) => {
        if (!t.abiName) {
            throw new Error('Encountered non-conforming type');
        }
        else if (t.abiName === '__struct') {
            throw new Error('Misconfigured Struct subclass, did you forget @Struct.type?');
        }
        if (seen.has(t)) {
            return t.abiName;
        }
        seen.add(t);
        if (t.abiAlias) {
            aliases.push({
                new_type_name: t.abiName,
                type: resolveAbiType(t.abiAlias),
            });
        }
        else if (t.abiFields) {
            const fields = t.abiFields.map((field) => {
                return {
                    name: field.name,
                    type: resolveAbiType(field),
                };
            });
            const struct = {
                base: t.abiBase ? resolve(t.abiBase) : '',
                name: t.abiName,
                fields,
            };
            structs.push(struct);
        }
        else if (t.abiVariant) {
            const variant = {
                name: t.abiName,
                types: t.abiVariant.map(resolveAbiType),
            };
            variants.push(variant);
        }
        return t.abiName;
    };
    const root = resolve(type);
    return {
        abi: ABI.from({ structs, variants, types: aliases }),
        types: Array.from(seen),
        root,
    };
}
function abiTypeString(type) {
    let typeName = typeof type.type === 'string' ? type.type : type.type.abiName;
    if (type.array === true) {
        typeName += '[]';
    }
    if (type.optional === true) {
        typeName += '?';
    }
    if (type.extension === true) {
        typeName += '$';
    }
    return typeName;
}
function isTypeDescriptor(type) {
    return (typeof type !== 'string' &&
        type.abiName === undefined &&
        type.type !== undefined);
}
function toTypeDescriptor(type) {
    if (typeof type === 'string') {
        return { type };
    }
    if (typeof type.abiName !== 'undefined') {
        return { type: type };
    }
    return type;
}

const StringType = {
    abiName: 'string',
    abiDefault: () => '',
    fromABI: (decoder) => {
        return decoder.readString();
    },
    from: (string) => string,
    toABI: (string, encoder) => {
        encoder.writeString(string);
    },
};
const BoolType = {
    abiName: 'bool',
    abiDefault: () => false,
    fromABI: (decoder) => {
        return decoder.readByte() === 1;
    },
    from: (value) => value,
    toABI: (value, encoder) => {
        encoder.writeByte(value === true ? 1 : 0);
    },
};
function getBuiltins() {
    return [
        // types represented by JavaScript builtins
        BoolType,
        StringType,
        // types represented by Classes
        Asset,
        Asset.Symbol,
        Asset.SymbolCode,
        BlockTimestamp,
        Bytes,
        Checksum160,
        Checksum256,
        Checksum512,
        ExtendedAsset,
        Float128,
        Float32,
        Float64,
        Int128,
        Int16,
        Int32,
        Int64,
        Int8,
        Name,
        PublicKey,
        Signature,
        TimePoint,
        TimePointSec,
        UInt128,
        UInt16,
        UInt32,
        UInt64,
        UInt8,
        VarInt,
        VarUInt,
    ];
}
function buildTypeLookup(additional = []) {
    const rv = {};
    const builtins = getBuiltins();
    for (const type of builtins) {
        rv[type.abiName] = type;
    }
    for (const type of additional) {
        if (!type.abiName) {
            throw new Error('Invalid type');
        }
        rv[type.abiName] = type;
    }
    return rv;
}
function getTypeName(object) {
    if (object.constructor && object.constructor.abiName !== undefined) {
        return object.constructor.abiName;
    }
    if (Array.isArray(object)) {
        const types = object.map(getTypeName);
        const type = types[0];
        if (!type || !types.every((t) => t === type)) {
            return;
        }
        return type + '[]';
    }
    switch (typeof object) {
        case 'boolean':
            return 'bool';
        case 'string':
            return 'string';
    }
}
function getType(object, name = 'jsobj') {
    var _a;
    if (object.constructor && object.constructor.abiName !== undefined) {
        return object.constructor;
    }
    if (Array.isArray(object)) {
        // check for array of all ABISerializableType with same type name
        const types = object.map((v) => {
            return getType(v, name);
        });
        const type = types[0];
        if (!type) {
            return; // some type not known
        }
        if (!types.every((t) => t && t.abiName === type.abiName)) {
            return; // not all types are the same
        }
        return type;
    }
    const objectType = typeof object;
    if (objectType === 'object' && object !== null) {
        const fields = Object.keys(object).map((key) => {
            return { name: key, type: getType(object[key], name + '_nested') };
        });
        if (fields.find((field) => !field.type)) {
            return; // encountered unknown type
        }
        return _a = class extends Struct {
            },
            _a.abiName = name,
            _a.abiFields = fields,
            _a;
    }
    switch (objectType) {
        case 'boolean':
            return BoolType;
        case 'string':
            return StringType;
    }
}

/**
 * Antelope/EOSIO ABI Decoder
 */
class DecodingError extends Error {
    constructor(ctx, underlyingError) {
        const path = ctx.codingPath
            .map(({ field, type }) => {
            if (typeof field === 'number') {
                return field;
            }
            else {
                return `${field}<${type.typeName}>`;
            }
        })
            .join('.');
        super(`Decoding error at ${path}: ${underlyingError.message}`);
        this.stack = underlyingError.stack;
        this.ctx = ctx;
        this.underlyingError = underlyingError;
    }
}
DecodingError.__className = 'DecodingError';
function abiDecode(args) {
    const descriptor = toTypeDescriptor(args.type);
    const typeName = abiTypeString(descriptor);
    const customTypes = args.customTypes || [];
    let abi;
    if (args.abi) {
        abi = ABI.from(args.abi);
    }
    else {
        try {
            let type;
            if (typeof descriptor.type === 'string') {
                const lookup = buildTypeLookup(customTypes);
                const rName = new ABI.ResolvedType(descriptor.type).name; // type name w/o suffixes
                type = lookup[rName];
                if (!type) {
                    throw new Error(`Unknown type: ${descriptor.type}`);
                }
            }
            else {
                type = descriptor.type;
            }
            const synthesized = synthesizeABI(type);
            abi = synthesized.abi;
            customTypes.push(...synthesized.types);
        }
        catch (error) {
            throw Error(`Unable to synthesize ABI for: ${typeName} (${error.message}). ` +
                'To decode non-class types you need to pass the ABI definition manually.');
        }
    }
    const resolved = abi.resolveType(typeName);
    if (typeof descriptor.type !== 'string') {
        customTypes.unshift(descriptor.type);
    }
    const ctx = {
        types: buildTypeLookup(customTypes),
        strictExtensions: args.strictExtensions || false,
        codingPath: [{ field: 'root', type: resolved }],
    };
    try {
        if (args.data || args.data === '') {
            let decoder;
            if (isInstanceOf(args.data, ABIDecoder)) {
                decoder = args.data;
            }
            else {
                const bytes = Bytes.from(args.data);
                const fatal = args.ignoreInvalidUTF8 === undefined ? true : !args.ignoreInvalidUTF8;
                decoder = new ABIDecoder(bytes.array, new TextDecoder('utf-8', { fatal }));
            }
            if (args.metadata) {
                decoder.metadata = args.metadata;
            }
            return decodeBinary(resolved, decoder, ctx);
        }
        else if (args.object !== undefined) {
            return decodeObject(args.object, resolved, ctx);
        }
        else if (args.json) {
            return decodeObject(JSON.parse(args.json), resolved, ctx);
        }
        else {
            throw new Error('Nothing to decode, you must set one of data, json, object');
        }
    }
    catch (error) {
        throw new DecodingError(ctx, error);
    }
}
/** Marker for objects when they have been resolved, i.e. their types `from` factory method will not need to resolve children. */
const Resolved = Symbol('Resolved');
function decodeBinary(type, decoder, ctx) {
    if (ctx.codingPath.length > 32) {
        throw new Error('Maximum decoding depth exceeded');
    }
    if (type.isExtension) {
        if (!decoder.canRead()) {
            if (ctx.strictExtensions) {
                return defaultValue(type, ctx);
            }
            else {
                return null;
            }
        }
    }
    if (type.isOptional) {
        if (decoder.readByte() === 0) {
            return null;
        }
    }
    if (type.isArray) {
        const len = decoder.readVaruint32();
        const rv = [];
        for (let i = 0; i < len; i++) {
            ctx.codingPath.push({ field: i, type });
            rv.push(decodeInner());
            ctx.codingPath.pop();
        }
        return rv;
    }
    else {
        return decodeInner();
    }
    function decodeInner() {
        const abiType = ctx.types[type.name];
        if (abiType && abiType.fromABI) {
            return abiType.fromABI(decoder);
        }
        else {
            if (type.ref) {
                // follow type alias
                ctx.codingPath.push({ field: '', type: type.ref });
                const rv = decodeBinary(type.ref, decoder, ctx);
                ctx.codingPath.pop();
                return rv;
            }
            else if (type.fields) {
                const fields = type.allFields;
                if (!fields) {
                    throw new Error('Invalid struct fields');
                }
                const rv = {};
                for (const field of fields) {
                    ctx.codingPath.push({ field: field.name, type: field.type });
                    rv[field.name] = decodeBinary(field.type, decoder, ctx);
                    ctx.codingPath.pop();
                }
                if (abiType) {
                    rv[Resolved] = true;
                    return abiType.from(rv);
                }
                else {
                    return rv;
                }
            }
            else if (type.variant) {
                const vIdx = decoder.readByte();
                const vType = type.variant[vIdx];
                if (!vType) {
                    throw new Error(`Unknown variant idx: ${vIdx}`);
                }
                ctx.codingPath.push({ field: `v${vIdx}`, type: vType });
                const rv = [vType.typeName, decodeBinary(vType, decoder, ctx)];
                ctx.codingPath.pop();
                if (abiType) {
                    return abiType.from(rv);
                }
                else {
                    return rv;
                }
            }
            else if (abiType) {
                throw new Error('Invalid type');
            }
            else {
                throw new Error(type.name === 'any' ? "Unable to decode 'any' type from binary" : 'Unknown type');
            }
        }
    }
}
function decodeObject(value, type, ctx) {
    if (value === null || value === undefined) {
        if (type.isOptional) {
            return null;
        }
        if (type.isExtension) {
            if (ctx.strictExtensions) {
                return defaultValue(type, ctx);
            }
            else {
                return null;
            }
        }
        throw new Error(`Unexpectedly encountered ${value} for non-optional (${ctx.codingPath
            .map((path) => path.field)
            .join('.')})`);
    }
    else if (type.isArray) {
        if (!Array.isArray(value)) {
            throw new Error('Expected array');
        }
        const rv = [];
        const len = value.length;
        for (let i = 0; i < len; i++) {
            ctx.codingPath.push({ field: i, type });
            rv.push(decodeInner(value[i]));
            ctx.codingPath.pop();
        }
        return rv;
    }
    else {
        return decodeInner(value);
    }
    function decodeInner(value) {
        const abiType = ctx.types[type.name];
        if (type.ref && !abiType) {
            // follow type alias
            return decodeObject(value, type.ref, ctx);
        }
        else if (type.fields) {
            if (typeof value !== 'object') {
                throw new Error('Expected object');
            }
            if (typeof abiType === 'function' && isInstanceOf(value, abiType)) {
                return value;
            }
            const fields = type.allFields;
            if (!fields) {
                throw new Error('Invalid struct fields');
            }
            const struct = {};
            for (const field of fields) {
                ctx.codingPath.push({ field: field.name, type: field.type });
                struct[field.name] = decodeObject(value[field.name], field.type, ctx);
                ctx.codingPath.pop();
            }
            if (abiType) {
                struct[Resolved] = true;
                return abiType.from(struct);
            }
            else {
                return struct;
            }
        }
        else if (type.variant) {
            let vName;
            if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'string') {
                vName = value[0];
                value = value[1];
            }
            else if (isInstanceOf(value, Variant)) {
                vName = value.variantName;
                value = value.value;
            }
            else {
                vName = getTypeName(value);
            }
            const vIdx = type.variant.findIndex((t) => t.typeName === vName);
            if (vIdx === -1) {
                throw new Error(`Unknown variant type: ${vName}`);
            }
            const vType = type.variant[vIdx];
            ctx.codingPath.push({ field: `v${vIdx}`, type: vType });
            const rv = [vType.typeName, decodeObject(value, vType, ctx)];
            ctx.codingPath.pop();
            if (abiType) {
                rv[Resolved] = true;
                return abiType.from(rv);
            }
            else {
                return rv;
            }
        }
        else {
            if (!abiType) {
                // special case for `any` when decoding from object
                if (type.name === 'any') {
                    return value;
                }
                throw new Error('Unknown type');
            }
            return abiType.from(value);
        }
    }
}
/** Return default value (aka initialized value, matching C++ where possible) for given type */
function defaultValue(type, ctx, seen = new Set()) {
    if (type.isArray) {
        return [];
    }
    if (type.isOptional) {
        return null;
    }
    const abiType = ctx.types[type.name];
    if (abiType && abiType.abiDefault) {
        return abiType.abiDefault();
    }
    if (seen.has(type.name)) {
        throw new Error('Circular type reference');
    }
    seen.add(type.name);
    if (type.allFields) {
        const rv = {};
        for (const field of type.allFields) {
            ctx.codingPath.push({ field: field.name, type: field.type });
            rv[field.name] = defaultValue(field.type, ctx, seen);
            ctx.codingPath.pop();
        }
        if (abiType) {
            rv[Resolved] = true;
            return abiType.from(rv);
        }
        return rv;
    }
    if (type.variant && type.variant.length > 0) {
        const rv = [type.variant[0].typeName, defaultValue(type.variant[0], ctx)];
        if (abiType) {
            rv[Resolved] = true;
            return abiType.from(rv);
        }
        return rv;
    }
    if (type.ref) {
        ctx.codingPath.push({ field: '', type: type.ref });
        const rv = defaultValue(type.ref, ctx, seen);
        ctx.codingPath.pop();
        return rv;
    }
    throw new Error('Unable to determine default value');
}
class ABIDecoder {
    constructor(array, textDecoder) {
        this.array = array;
        this.pos = 0;
        /** User declared metadata, can be used to pass info to instances when decoding.  */
        this.metadata = {};
        this.textDecoder = textDecoder || new TextDecoder('utf-8', { fatal: true });
        this.data = new DataView(array.buffer, array.byteOffset, array.byteLength);
    }
    canRead(bytes = 1) {
        return !(this.pos + bytes > this.array.byteLength);
    }
    ensure(bytes) {
        if (!this.canRead(bytes)) {
            throw new Error('Read past end of buffer');
        }
    }
    setPosition(pos) {
        if (pos < 0 || pos > this.array.byteLength) {
            throw new Error('Invalid position');
        }
        this.pos = pos;
    }
    getPosition() {
        return this.pos;
    }
    advance(bytes) {
        this.ensure(bytes);
        this.pos += bytes;
    }
    /** Read one byte. */
    readByte() {
        this.ensure(1);
        return this.array[this.pos++];
    }
    /** Read floating point as JavaScript number, 32 or 64 bits. */
    readFloat(byteWidth) {
        this.ensure(byteWidth);
        let rv;
        switch (byteWidth) {
            case 4:
                rv = this.data.getFloat32(this.pos, true);
                break;
            case 8:
                rv = this.data.getFloat64(this.pos, true);
                break;
            default:
                throw new Error('Invalid float size');
        }
        this.pos += byteWidth;
        return rv;
    }
    readVaruint32() {
        let v = 0;
        let bit = 0;
        for (;;) {
            const b = this.readByte();
            v |= (b & 0x7f) << bit;
            bit += 7;
            if (!(b & 0x80)) {
                break;
            }
        }
        return v >>> 0;
    }
    readVarint32() {
        const v = this.readVaruint32();
        if (v & 1) {
            return (~v >> 1) | 2147483648;
        }
        else {
            return v >>> 1;
        }
    }
    readArray(length) {
        this.ensure(length);
        const rv = this.array.subarray(this.pos, this.pos + length);
        this.pos += length;
        return rv;
    }
    readString() {
        const length = this.readVaruint32();
        return this.textDecoder.decode(this.readArray(length));
    }
}
ABIDecoder.__className = 'ABIDecoder';

/**
 * Antelope/EOSIO ABI Encoder
 */
class EncodingError extends Error {
    constructor(ctx, underlyingError) {
        const path = ctx.codingPath
            .map(({ field, type }) => {
            if (typeof field === 'number') {
                return field;
            }
            else {
                return `${field}<${type.typeName}>`;
            }
        })
            .join('.');
        super(`Encoding error at ${path}: ${underlyingError.message}`);
        this.stack = underlyingError.stack;
        this.ctx = ctx;
        this.underlyingError = underlyingError;
    }
}
EncodingError.__className = 'EncodingError';
function abiEncode(args) {
    let type;
    let typeName;
    if (typeof args.type === 'string') {
        typeName = args.type;
    }
    else if (args.type && isTypeDescriptor(args.type)) {
        if (typeof args.type.type !== 'string') {
            type = args.type.type;
        }
        typeName = abiTypeString(args.type);
    }
    else if (args.type && args.type.abiName !== undefined) {
        type = args.type;
        typeName = args.type.abiName;
    }
    else {
        type = getType(args.object);
        if (type) {
            typeName = type.abiName;
            if (Array.isArray(args.object)) {
                typeName += '[]';
            }
        }
    }
    const customTypes = args.customTypes ? args.customTypes.slice() : [];
    if (type) {
        customTypes.unshift(type);
    }
    else if (typeName) {
        const rootName = new ABI.ResolvedType(typeName).name;
        type = customTypes.find((t) => t.abiName === rootName);
    }
    let rootType;
    if (args.abi && typeName) {
        rootType = ABI.from(args.abi).resolveType(typeName);
    }
    else if (type) {
        const synthesized = synthesizeABI(type);
        rootType = synthesized.abi.resolveType(typeName || type.abiName);
        customTypes.push(...synthesized.types);
    }
    else if (typeName) {
        rootType = new ABI.ResolvedType(typeName);
    }
    else {
        throw new Error('Unable to determine the type of the object to be encoded. ' +
            'To encode custom ABI types you must pass the type argument.');
    }
    const types = buildTypeLookup(customTypes);
    const encoder = args.encoder || new ABIEncoder();
    if (args.metadata) {
        encoder.metadata = args.metadata;
    }
    const ctx = {
        types,
        encoder,
        codingPath: [{ field: 'root', type: rootType }],
    };
    try {
        encodeAny(args.object, rootType, ctx);
    }
    catch (error) {
        throw new EncodingError(ctx, error);
    }
    return Bytes.from(encoder.getData());
}
function encodeAny(value, type, ctx) {
    const valueExists = value !== undefined && value !== null;
    if (type.isOptional) {
        ctx.encoder.writeByte(valueExists ? 1 : 0);
        if (!valueExists) {
            return;
        }
    }
    if (type.isArray) {
        if (!Array.isArray(value)) {
            throw new Error(`Expected array for: ${type.typeName}`);
        }
        const len = value.length;
        ctx.encoder.writeVaruint32(len);
        for (let i = 0; i < len; i++) {
            ctx.codingPath.push({ field: i, type });
            encodeInner(value[i]);
            ctx.codingPath.pop();
        }
    }
    else {
        encodeInner(value);
    }
    function encodeInner(value) {
        const abiType = ctx.types[type.name];
        if (type.ref && !abiType) {
            // type is alias, follow it
            encodeAny(value, type.ref, ctx);
            return;
        }
        if (!valueExists) {
            if (type.isExtension) {
                return;
            }
            throw new Error(`Found ${value} for non-optional type: ${type.typeName} (${ctx.codingPath
                .map((path) => path.field)
                .join('.')})`);
        }
        if (abiType && abiType.toABI) {
            // type explicitly handles encoding
            abiType.toABI(value, ctx.encoder);
        }
        else if (typeof value.toABI === 'function' && value.constructor.abiName === type.name) {
            // instance handles encoding
            value.toABI(ctx.encoder);
        }
        else {
            // encode according to abi def if possible
            if (type.fields) {
                if (typeof value !== 'object') {
                    throw new Error(`Expected object for: ${type.name}`);
                }
                const fields = type.allFields;
                if (!fields) {
                    throw new Error('Invalid struct fields');
                }
                for (const field of fields) {
                    ctx.codingPath.push({ field: field.name, type: field.type });
                    encodeAny(value[field.name], field.type, ctx);
                    ctx.codingPath.pop();
                }
            }
            else if (type.variant) {
                let vName;
                if (Array.isArray(value) && value.length === 2 && typeof value[0] === 'string') {
                    vName = value[0];
                    value = value[1];
                }
                else if (isInstanceOf(value, Variant)) {
                    vName = value.variantName;
                    value = value.value;
                }
                else {
                    vName = getTypeName(value);
                }
                const vIdx = type.variant.findIndex((t) => t.typeName === vName);
                if (vIdx === -1) {
                    const types = type.variant.map((t) => `'${t.typeName}'`).join(', ');
                    throw new Error(`Unknown variant type '${vName}', expected one of ${types}`);
                }
                const vType = type.variant[vIdx];
                ctx.encoder.writeVaruint32(vIdx);
                ctx.codingPath.push({ field: `v${vIdx}`, type: vType });
                encodeAny(value, vType, ctx);
                ctx.codingPath.pop();
            }
            else {
                if (!abiType) {
                    throw new Error(type.name === 'any' ? 'Unable to encode any type to binary' : 'Unknown type');
                }
                const instance = abiType.from(value);
                if (!instance.toABI) {
                    throw new Error(`Invalid type ${type.name}, no encoding methods implemented`);
                }
                instance.toABI(ctx.encoder);
            }
        }
    }
}
class ABIEncoder {
    constructor(pageSize = 1024) {
        this.pageSize = pageSize;
        this.pos = 0;
        this.textEncoder = new TextEncoder();
        /** User declared metadata, can be used to pass info to instances when encoding.  */
        this.metadata = {};
        const buffer = new ArrayBuffer(pageSize);
        this.data = new DataView(buffer);
        this.array = new Uint8Array(buffer);
    }
    ensure(bytes) {
        if (this.data.byteLength >= this.pos + bytes) {
            return;
        }
        const pages = Math.ceil(bytes / this.pageSize);
        const newSize = this.data.byteLength + this.pageSize * pages;
        const buffer = new ArrayBuffer(newSize);
        const data = new DataView(buffer);
        const array = new Uint8Array(buffer);
        array.set(this.array);
        this.data = data;
        this.array = array;
    }
    /** Write a single byte. */
    writeByte(byte) {
        this.ensure(1);
        this.array[this.pos++] = byte;
    }
    /** Write an array of bytes. */
    writeArray(bytes) {
        const size = bytes.length;
        this.ensure(size);
        this.array.set(bytes, this.pos);
        this.pos += size;
    }
    writeFloat(value, byteWidth) {
        this.ensure(byteWidth);
        switch (byteWidth) {
            case 4:
                this.data.setFloat32(this.pos, value, true);
                break;
            case 8:
                this.data.setFloat64(this.pos, value, true);
                break;
            default:
                throw new Error('Invalid float size');
        }
        this.pos += byteWidth;
    }
    writeVaruint32(v) {
        this.ensure(4);
        for (;;) {
            if (v >>> 7) {
                this.array[this.pos++] = 0x80 | (v & 0x7f);
                v = v >>> 7;
            }
            else {
                this.array[this.pos++] = v;
                break;
            }
        }
    }
    writeVarint32(v) {
        this.writeVaruint32((v << 1) ^ (v >> 31));
    }
    writeString(v) {
        const data = this.textEncoder.encode(v);
        this.writeVaruint32(data.byteLength);
        this.writeArray(data);
    }
    getData() {
        return new Uint8Array(this.array.buffer, this.array.byteOffset, this.pos);
    }
    getBytes() {
        return new Bytes(this.getData());
    }
}
ABIEncoder.__className = 'ABIEncoder';

class ABI {
    constructor(args) {
        this.version = args.version || ABI.version;
        this.types = args.types || [];
        this.variants = args.variants || [];
        this.structs = args.structs || [];
        this.actions = args.actions || [];
        this.tables = args.tables || [];
        this.ricardian_clauses = args.ricardian_clauses || [];
        this.action_results = args.action_results || [];
    }
    static from(value) {
        if (isInstanceOf(value, ABI)) {
            return value;
        }
        if (isInstanceOf(value, Blob)) {
            return abiDecode({
                data: value.array,
                type: this,
            });
        }
        if (typeof value === 'string') {
            return new ABI(JSON.parse(value));
        }
        return new ABI(value);
    }
    static fromABI(decoder) {
        const version = decoder.readString();
        const types = [];
        const numTypes = decoder.readVaruint32();
        for (let i = 0; i < numTypes; i++) {
            types.push({
                new_type_name: decoder.readString(),
                type: decoder.readString(),
            });
        }
        const structs = [];
        const numStructs = decoder.readVaruint32();
        for (let i = 0; i < numStructs; i++) {
            const name = decoder.readString();
            const base = decoder.readString();
            const numFields = decoder.readVaruint32();
            const fields = [];
            for (let j = 0; j < numFields; j++) {
                fields.push({ name: decoder.readString(), type: decoder.readString() });
            }
            structs.push({ base, name, fields });
        }
        const actions = [];
        const numActions = decoder.readVaruint32();
        for (let i = 0; i < numActions; i++) {
            const name = Name.fromABI(decoder);
            const type = decoder.readString();
            const ricardian_contract = decoder.readString();
            actions.push({ name, type, ricardian_contract });
        }
        const tables = [];
        const numTables = decoder.readVaruint32();
        for (let i = 0; i < numTables; i++) {
            const name = Name.fromABI(decoder);
            const index_type = decoder.readString();
            const key_names = [];
            const numKeyNames = decoder.readVaruint32();
            for (let j = 0; j < numKeyNames; j++) {
                key_names.push(decoder.readString());
            }
            const key_types = [];
            const numKeyTypes = decoder.readVaruint32();
            for (let j = 0; j < numKeyTypes; j++) {
                key_types.push(decoder.readString());
            }
            const type = decoder.readString();
            tables.push({ name, index_type, key_names, key_types, type });
        }
        const ricardian_clauses = [];
        const numClauses = decoder.readVaruint32();
        for (let i = 0; i < numClauses; i++) {
            const id = decoder.readString();
            const body = decoder.readString();
            ricardian_clauses.push({ id, body });
        }
        // error_messages, never used?
        const numErrors = decoder.readVaruint32();
        for (let i = 0; i < numErrors; i++) {
            decoder.advance(8); // uint64 error_code
            decoder.advance(decoder.readVaruint32()); // string error_msgr
        }
        // extensions, not used
        const numExtensions = decoder.readVaruint32();
        for (let i = 0; i < numExtensions; i++) {
            decoder.advance(2); // uint16 type
            decoder.advance(decoder.readVaruint32()); // bytes data
        }
        // variants is a binary extension for some reason even though extensions are defined on the type
        const variants = [];
        if (decoder.canRead()) {
            const numVariants = decoder.readVaruint32();
            for (let i = 0; i < numVariants; i++) {
                const name = decoder.readString();
                const types = [];
                const numTypes = decoder.readVaruint32();
                for (let j = 0; j < numTypes; j++) {
                    types.push(decoder.readString());
                }
                variants.push({ name, types });
            }
        }
        const action_results = [];
        if (decoder.canRead()) {
            const numActionResults = decoder.readVaruint32();
            for (let i = 0; i < numActionResults; i++) {
                const name = Name.fromABI(decoder);
                const result_type = decoder.readString();
                action_results.push({ name, result_type });
            }
        }
        return new ABI({
            version,
            types,
            structs,
            actions,
            tables,
            ricardian_clauses,
            variants,
            action_results,
        });
    }
    toABI(encoder) {
        encoder.writeString(this.version);
        encoder.writeVaruint32(this.types.length);
        for (const type of this.types) {
            encoder.writeString(type.new_type_name);
            encoder.writeString(type.type);
        }
        encoder.writeVaruint32(this.structs.length);
        for (const struct of this.structs) {
            encoder.writeString(struct.name);
            encoder.writeString(struct.base);
            encoder.writeVaruint32(struct.fields.length);
            for (const field of struct.fields) {
                encoder.writeString(field.name);
                encoder.writeString(field.type);
            }
        }
        encoder.writeVaruint32(this.actions.length);
        for (const action of this.actions) {
            Name.from(action.name).toABI(encoder);
            encoder.writeString(action.type);
            encoder.writeString(action.ricardian_contract);
        }
        encoder.writeVaruint32(this.tables.length);
        for (const table of this.tables) {
            Name.from(table.name).toABI(encoder);
            encoder.writeString(table.index_type);
            encoder.writeVaruint32(table.key_names.length);
            for (const key of table.key_names) {
                encoder.writeString(key);
            }
            encoder.writeVaruint32(table.key_types.length);
            for (const key of table.key_types) {
                encoder.writeString(key);
            }
            encoder.writeString(table.type);
        }
        encoder.writeVaruint32(this.ricardian_clauses.length);
        for (const clause of this.ricardian_clauses) {
            encoder.writeString(clause.id);
            encoder.writeString(clause.body);
        }
        encoder.writeVaruint32(0); // error_messages
        encoder.writeVaruint32(0); // extensions
        encoder.writeVaruint32(this.variants.length);
        for (const variant of this.variants) {
            encoder.writeString(variant.name);
            encoder.writeVaruint32(variant.types.length);
            for (const type of variant.types) {
                encoder.writeString(type);
            }
        }
        encoder.writeVaruint32(this.action_results.length);
        for (const result of this.action_results) {
            Name.from(result.name).toABI(encoder);
            encoder.writeString(result.result_type);
        }
    }
    resolveType(name) {
        const types = {};
        return this.resolve({ name, types }, { id: 0 });
    }
    resolveAll() {
        const types = {};
        const ctx = { id: 0 };
        return {
            types: this.types.map((t) => this.resolve({ name: t.new_type_name, types }, ctx)),
            variants: this.variants.map((t) => this.resolve({ name: t.name, types }, ctx)),
            structs: this.structs.map((t) => this.resolve({ name: t.name, types }, ctx)),
        };
    }
    resolve({ name, types }, ctx) {
        const existing = types[name];
        if (existing) {
            return existing;
        }
        const type = new ABI.ResolvedType(name, ++ctx.id);
        types[type.typeName] = type;
        const alias = this.types.find((typeDef) => typeDef.new_type_name == type.name);
        if (alias) {
            type.ref = this.resolve({ name: alias.type, types }, ctx);
            return type;
        }
        const struct = this.getStruct(type.name);
        if (struct) {
            if (struct.base) {
                type.base = this.resolve({ name: struct.base, types }, ctx);
            }
            type.fields = struct.fields.map((field) => {
                return {
                    name: field.name,
                    type: this.resolve({ name: field.type, types }, ctx),
                };
            });
            return type;
        }
        const variant = this.getVariant(type.name);
        if (variant) {
            type.variant = variant.types.map((name) => this.resolve({ name, types }, ctx));
            return type;
        }
        // builtin or unknown type
        return type;
    }
    getStruct(name) {
        return this.structs.find((struct) => struct.name == name);
    }
    getVariant(name) {
        return this.variants.find((variant) => variant.name == name);
    }
    /** Return arguments type of an action in this ABI. */
    getActionType(actionName) {
        const name = Name.from(actionName).toString();
        const action = this.actions.find((a) => a.name.toString() === name);
        if (action) {
            return action.type;
        }
    }
    equals(other) {
        const o = ABI.from(other);
        if (this.version != o.version ||
            this.types.length != o.types.length ||
            this.structs.length != o.structs.length ||
            this.actions.length != o.actions.length ||
            this.tables.length != o.tables.length ||
            this.ricardian_clauses.length != o.ricardian_clauses.length ||
            this.variants.length != o.variants.length ||
            this.action_results.length != o.action_results.length) {
            return false;
        }
        return abiEncode({ object: this }).equals(abiEncode({ object: o }));
    }
    toJSON() {
        return {
            version: this.version,
            types: this.types,
            structs: this.structs,
            actions: this.actions,
            tables: this.tables,
            ricardian_clauses: this.ricardian_clauses,
            error_messages: [],
            abi_extensions: [],
            variants: this.variants,
            action_results: this.action_results,
        };
    }
}
ABI.abiName = 'abi';
ABI.version = 'sysio::abi/1.1';
(function (ABI) {
    class ResolvedType {
        constructor(fullName, id = 0) {
            let name = fullName;
            if (name.endsWith('$')) {
                name = name.slice(0, -1);
                this.isExtension = true;
            }
            else {
                this.isExtension = false;
            }
            if (name.endsWith('?')) {
                name = name.slice(0, -1);
                this.isOptional = true;
            }
            else {
                this.isOptional = false;
            }
            if (name.endsWith('[]')) {
                name = name.slice(0, -2);
                this.isArray = true;
            }
            else {
                this.isArray = false;
            }
            this.id = id;
            this.name = name;
        }
        /**
         * Type name including suffixes: [] array, ? optional, $ binary ext
         */
        get typeName() {
            let rv = this.name;
            if (this.isArray) {
                rv += '[]';
            }
            if (this.isOptional) {
                rv += '?';
            }
            if (this.isExtension) {
                rv += '$';
            }
            return rv;
        }
        /** All fields including base struct(s), undefined if not a struct type. */
        get allFields() {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let current = this;
            const rv = [];
            const seen = new Set();
            do {
                if (!current.fields) {
                    return; // invalid struct
                }
                if (seen.has(current.name)) {
                    return; // circular ref
                }
                for (let i = current.fields.length - 1; i >= 0; i--) {
                    rv.unshift(current.fields[i]);
                }
                seen.add(current.name);
                current = current.base;
            } while (current !== undefined);
            return rv;
        }
    }
    ABI.ResolvedType = ResolvedType;
})(ABI || (ABI = {}));

class Struct {
    static from(value) {
        if (value[Resolved] === true) {
            // objects already resolved
            return new this(value);
        }
        if (isInstanceOf(value, this)) {
            return value;
        }
        return abiDecode({ object: value, type: this });
    }
    static get structFields() {
        const rv = [];
        const walk = (t) => {
            if (t.abiBase) {
                walk(t.abiBase);
            }
            for (const field of t.abiFields || []) {
                rv.push(field);
            }
        };
        walk(this);
        return rv;
    }
    /** @internal */
    constructor(object) {
        const self = this.constructor;
        for (const field of self.structFields) {
            const isOptional = typeof field.type === 'string'
                ? new ABI.ResolvedType(String(field.type)).isOptional
                : field.optional;
            const value = object[field.name];
            if (isOptional && !value)
                continue;
            this[field.name] = value;
        }
    }
    /**
     * Return true if this struct equals the other.
     *
     * Note: This compares the ABI encoded bytes of both structs, subclasses
     *       should implement their own fast equality check when possible.
     */
    equals(other) {
        const self = this.constructor;
        if (other.constructor &&
            typeof other.constructor.abiName === 'string' &&
            other.constructor.abiName !== self.abiName) {
            return false;
        }
        return abiEncode({ object: this }).equals(abiEncode({ object: self.from(other) }));
    }
    /** @internal */
    toJSON() {
        const self = this.constructor;
        const rv = {};
        for (const field of self.structFields) {
            if (field.optional && !this[field.name])
                continue;
            rv[field.name] = this[field.name];
        }
        return rv;
    }
}
Struct.abiName = '__struct';
(function (Struct) {
    const FieldsOwner = Symbol('FieldsOwner');
    function type(name) {
        return function (struct) {
            struct.abiName = name;
            return struct;
        };
    }
    Struct.type = type;
    function field(type, options = {}) {
        return (target, name) => {
            const ctor = target.constructor;
            if (!ctor.abiFields) {
                ctor.abiFields = [];
                ctor.abiFields[FieldsOwner] = ctor;
            }
            else if (ctor.abiFields[FieldsOwner] !== ctor) {
                // if the target class isn't the owner we set the base and start new fields
                ctor.abiBase = ctor.abiFields[FieldsOwner];
                ctor.abiFields = [];
                ctor.abiFields[FieldsOwner] = ctor;
            }
            ctor.abiFields.push({ ...options, name, type });
        };
    }
    Struct.field = field;
})(Struct || (Struct = {}));

function TypeAlias(name) {
    return function (typeAlias) {
        typeAlias.abiAlias = {
            type: Object.getPrototypeOf(typeAlias.prototype).constructor,
        };
        typeAlias.abiName = name;
        return typeAlias;
    };
}

class Variant {
    static from(object) {
        if (object[Resolved]) {
            return new this(object);
        }
        if (isInstanceOf(object, this)) {
            return object;
        }
        return abiDecode({ object, type: this });
    }
    /** @internal */
    constructor(variant) {
        const abiVariant = this.constructor.abiVariant;
        this.value = variant[1];
        const variantIdx = abiVariant.map(abiTypeString).findIndex((t) => t === variant[0]);
        if (0 > variantIdx || abiVariant.length <= variantIdx) {
            throw new Error(`Unknown variant ${variant[0]}`);
        }
        this.variantIdx = variantIdx;
    }
    /**
     * Return true if this variant equals the other.
     *
     * Note: This compares the ABI encoded bytes of both variants, subclasses
     *       should implement their own fast equality check when possible.
     */
    equals(other) {
        const self = this.constructor;
        const otherVariant = self.from(other);
        if (this.variantIdx !== otherVariant.variantIdx) {
            return false;
        }
        return abiEncode({ object: this }).equals(abiEncode({ object: otherVariant }));
    }
    get variantName() {
        const variant = this.constructor.abiVariant[this.variantIdx];
        return abiTypeString(variant);
    }
    /** @internal */
    toJSON() {
        return [this.variantName, this.value];
    }
}
Variant.abiName = '__variant';
Variant.abiVariant = [];
(function (Variant) {
    function type(name, types) {
        return function (variant) {
            variant.abiName = name;
            variant.abiVariant = types.map(toTypeDescriptor);
            return variant;
        };
    }
    Variant.type = type;
})(Variant || (Variant = {}));

class Float {
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (typeof value === 'string') {
            value = Number.parseFloat(value);
        }
        else if (isInstanceOf(value, Float)) {
            value = value.value;
        }
        return new this(value);
    }
    static fromABI(decoder) {
        return new this(decoder.readFloat(this.byteWidth));
    }
    static abiDefault() {
        return this.from(0);
    }
    static random() {
        const bytes = secureRandom(this.byteWidth);
        const decoder = new ABIDecoder(bytes);
        return this.fromABI(decoder);
    }
    constructor(value) {
        this.value = value;
    }
    equals(other) {
        const self = this.constructor;
        return this.value === self.from(other).value;
    }
    toABI(encoder) {
        const self = this.constructor;
        encoder.writeFloat(this.value, self.byteWidth);
    }
    toString() {
        return this.value.toString();
    }
    toJSON() {
        return this.toString();
    }
}
Float.abiName = '__float';
class Float32 extends Float {
    toString() {
        return this.value.toFixed(7);
    }
}
Float32.abiName = 'float32';
Float32.byteWidth = 4;
class Float64 extends Float {
}
Float64.abiName = 'float64';
Float64.byteWidth = 8;
class Float128 {
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (typeof value === 'string' && value.startsWith('0x')) {
            value = value.slice(2);
        }
        return new this(Bytes.from(value));
    }
    static fromABI(decoder) {
        return new this(new Bytes(decoder.readArray(this.byteWidth)));
    }
    static random() {
        const bytes = secureRandom(16);
        const decoder = new ABIDecoder(bytes);
        return this.fromABI(decoder);
    }
    constructor(data) {
        if (data.array.length !== 16) {
            throw new Error('Invalid float128');
        }
        this.data = data;
    }
    equals(other) {
        const self = this.constructor;
        return this.data.equals(self.from(other).data);
    }
    toABI(encoder) {
        encoder.writeArray(this.data.array);
    }
    toString() {
        // float128 uses 0x prefixed hex strings as opposed to everywhere else in where there is no prefix ¯\_(ツ)_/¯
        return '0x' + this.data.hexString;
    }
    toJSON() {
        return this.toString();
    }
}
Float128.abiName = 'float128';
Float128.byteWidth = 16;

class Name {
    /**
     * The raw representation of the name.
     * @deprecated Use value instead.
     */
    get rawValue() {
        return this.value;
    }
    /** Create a new Name instance from any of its representing types. */
    static from(value) {
        if (isInstanceOf(value, Name)) {
            return value;
        }
        else if (typeof value === 'string') {
            return new Name(stringToName(value));
        }
        else if (isInstanceOf(value, UInt64)) {
            return new Name(value);
        }
        else {
            throw new Error('Invalid name');
        }
    }
    static fromABI(decoder) {
        return new Name(UInt64.fromABI(decoder));
    }
    static abiDefault() {
        return new this(UInt64.from(0));
    }
    constructor(value) {
        this.value = value;
    }
    /** Return true if this name is equal to passed name. */
    equals(other) {
        return this.value.equals(Name.from(other).value);
    }
    /** Return string representation of this name. */
    toString() {
        return nameToString(this.value);
    }
    toABI(encoder) {
        this.value.toABI(encoder);
    }
    /** @internal */
    toJSON() {
        return this.toString();
    }
}
Name.abiName = 'name';
/** Regex pattern matching a Wire name, case-sensitive. */
Name.pattern = /^[a-z1-5.]{0,13}$/;
function stringToName(s) {
    function charToSymbol(c) {
        if (c >= 'a'.charCodeAt(0) && c <= 'z'.charCodeAt(0)) {
            return c - 'a'.charCodeAt(0) + 6;
        }
        if (c >= '1'.charCodeAt(0) && c <= '5'.charCodeAt(0)) {
            return c - '1'.charCodeAt(0) + 1;
        }
        return 0;
    }
    const a = new Uint8Array(8);
    let bit = 63;
    for (let i = 0; i < s.length; ++i) {
        let c = charToSymbol(s.charCodeAt(i));
        if (bit < 5) {
            c = c << 1;
        }
        for (let j = 4; j >= 0; --j) {
            if (bit >= 0) {
                a[Math.floor(bit / 8)] |= ((c >> j) & 1) << bit % 8;
                --bit;
            }
        }
    }
    return UInt64.from(a);
}
function nameToString(n) {
    const a = n.value.toArray('le', 8);
    let result = '';
    for (let bit = 63; bit >= 0;) {
        let c = 0;
        for (let i = 0; i < 5; ++i) {
            if (bit >= 0) {
                c = (c << 1) | ((a[Math.floor(bit / 8)] >> bit % 8) & 1);
                --bit;
            }
        }
        if (c >= 6) {
            result += String.fromCharCode(c + 'a'.charCodeAt(0) - 6);
        }
        else if (c >= 1) {
            result += String.fromCharCode(c + '1'.charCodeAt(0) - 1);
        }
        else {
            result += '.';
        }
    }
    while (result.endsWith('.')) {
        result = result.substr(0, result.length - 1);
    }
    return result;
}

class TimePointBase {
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (isInstanceOf(value, TimePointBase)) {
            // converting between types
            return this.fromMilliseconds(value.toMilliseconds());
        }
        if (isInstanceOf(value, Date)) {
            return this.fromDate(value);
        }
        if (typeof value === 'string') {
            return this.fromString(value);
        }
        return this.fromInteger(value);
    }
    static fromString(string) {
        const value = Date.parse(string + 'Z');
        if (!Number.isFinite(value)) {
            throw new Error('Invalid date string');
        }
        return this.fromMilliseconds(value);
    }
    static fromDate(date) {
        return this.fromMilliseconds(date.getTime());
    }
    static abiDefault() {
        return this.from(0);
    }
    toABI(encoder) {
        const self = this;
        self.value.toABI(encoder);
    }
    equals(other) {
        const self = this.constructor;
        return this.toMilliseconds() === self.from(other).toMilliseconds();
    }
    toMilliseconds() {
        throw new Error('Not implemented');
    }
    toDate() {
        return new Date(this.toMilliseconds());
    }
    toJSON() {
        return this.toString();
    }
}
TimePointBase.abiName = '__time_point_base';
/** Timestamp with microsecond accuracy. */
class TimePoint extends TimePointBase {
    static fromMilliseconds(ms) {
        return new this(Int64.from(Math.round(ms * 1000)));
    }
    static fromInteger(value) {
        return new this(Int64.from(value));
    }
    static fromABI(decoder) {
        return new this(Int64.fromABI(decoder));
    }
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.toDate().toISOString().slice(0, -1);
    }
    toMilliseconds() {
        return Number(this.value.dividing(1000, 'round'));
    }
}
TimePoint.abiName = 'time_point';
/** Timestamp with second accuracy. */
class TimePointSec extends TimePointBase {
    static fromMilliseconds(ms) {
        return new this(UInt32.from(Math.round(ms / 1000)));
    }
    static fromInteger(value) {
        return new this(UInt32.from(value));
    }
    static fromABI(decoder) {
        return new this(UInt32.fromABI(decoder));
    }
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.toDate().toISOString().slice(0, -5);
    }
    toMilliseconds() {
        return Number(this.value.cast(UInt64).multiplying(1000));
    }
}
TimePointSec.abiName = 'time_point_sec';
class BlockTimestamp extends TimePointBase {
    static fromMilliseconds(ms) {
        return new this(UInt32.from(Math.round((ms - 946684800000) / 500)));
    }
    static fromInteger(value) {
        return new this(UInt32.from(value));
    }
    static fromABI(decoder) {
        return new this(UInt32.fromABI(decoder));
    }
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.toDate().toISOString().slice(0, -1);
    }
    toMilliseconds() {
        return Number(this.value.cast(UInt64).multiplying(500).adding(946684800000));
    }
}
BlockTimestamp.abiName = 'block_timestamp_type';

class Asset {
    static from(value, symbol) {
        if (isInstanceOf(value, Asset)) {
            return value;
        }
        switch (typeof value) {
            case 'number':
                if (!symbol) {
                    throw new Error('Symbol is required when creating Asset from number');
                }
                return this.fromFloat(value, symbol);
            case 'string':
                return this.fromString(value);
            default:
                throw new Error('Invalid asset');
        }
    }
    static fromString(value) {
        const parts = (typeof value === 'string' ? value : '').split(' ');
        if (parts.length !== 2) {
            throw new Error('Invalid asset string');
        }
        const amount = parts[0].replace('.', '');
        const precision = (parts[0].split('.')[1] || '').length;
        const symbol = Asset.Symbol.fromParts(parts[1], precision);
        return new Asset(Int64.from(amount), symbol);
    }
    static fromFloat(value, symbol) {
        const s = Asset.Symbol.from(symbol);
        return new Asset(s.convertFloat(value), s);
    }
    static fromUnits(value, symbol) {
        return new Asset(Int64.from(value), Asset.Symbol.from(symbol));
    }
    static fromABI(decoder) {
        const units = Int64.fromABI(decoder);
        const symbol = Asset.Symbol.fromABI(decoder);
        return new Asset(units, symbol);
    }
    static abiDefault() {
        return new this(Int64.from(0), Asset.Symbol.abiDefault());
    }
    static formatUnits(units, precision) {
        const digits = Int64.from(units).toString().split('');
        let negative = false;
        if (digits[0] === '-') {
            negative = true;
            digits.shift();
        }
        while (digits.length <= precision) {
            digits.unshift('0');
        }
        if (precision > 0) {
            digits.splice(digits.length - precision, 0, '.');
        }
        let rv = digits.join('');
        if (negative) {
            rv = '-' + rv;
        }
        return rv;
    }
    constructor(units, symbol) {
        this.units = units;
        this.symbol = symbol;
    }
    equals(other) {
        const { symbol, units } = Asset.from(other);
        return this.symbol.value.equals(symbol.value) && this.units.equals(units);
    }
    get value() {
        return this.symbol.convertUnits(this.units);
    }
    set value(newValue) {
        this.units = this.symbol.convertFloat(newValue);
    }
    get quantity() {
        return Asset.formatUnits(this.units, this.symbol.precision);
    }
    toABI(encoder) {
        this.units.toABI(encoder);
        this.symbol.toABI(encoder);
    }
    toString() {
        return this.quantity + ' ' + this.symbol.name;
    }
    toJSON() {
        return this.toString();
    }
}
Asset.abiName = 'asset';
(function (Asset) {
    class Symbol {
        static from(value) {
            if (isInstanceOf(value, Symbol)) {
                return value;
            }
            if (isInstanceOf(value, UInt64)) {
                return new Symbol(value);
            }
            const parts = value.split(',');
            if (parts.length !== 2 && value !== '0,') {
                throw new Error('Invalid symbol string');
            }
            if (value === '0,') {
                parts.push('');
            }
            const precision = Number.parseInt(parts[0]);
            return Symbol.fromParts(parts[1], precision);
        }
        static fromParts(name, precision) {
            return new Symbol(toRawSymbol(name, precision));
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        static fromABI(decoder) {
            return new Symbol(UInt64.fromABI(decoder));
        }
        static abiDefault() {
            return this.from('4,SYS'); // CORE_SYMBOL = 4,CORE_SYMBOL_NAME
        }
        constructor(value) {
            if (toSymbolPrecision(value) > Symbol.maxPrecision) {
                throw new Error('Invalid asset symbol, precision too large');
            }
            if (!value.equals(0) && !SymbolCode.pattern.test(toSymbolName(value))) {
                throw new Error('Invalid asset symbol, name must be uppercase A-Z');
            }
            this.value = value;
        }
        equals(other) {
            return this.value.equals(Symbol.from(other).value);
        }
        get name() {
            return toSymbolName(this.value);
        }
        get precision() {
            return toSymbolPrecision(this.value);
        }
        get code() {
            return new SymbolCode(UInt64.from(this.value.value.clone().iushrn(8)));
        }
        toABI(encoder) {
            this.value.toABI(encoder);
        }
        /**
         * Convert units to floating point number according to symbol precision.
         * @throws If the given units can't be represented in 53 bits.
         **/
        convertUnits(units) {
            return units.value.toNumber() / Math.pow(10, this.precision);
        }
        /**
         * Convert floating point to units according to symbol precision.
         * Note that the value will be rounded to closest precision.
         **/
        convertFloat(float) {
            return Int64.from(float.toFixed(this.precision).replace('.', ''));
        }
        toString() {
            return `${this.precision},${this.name}`;
        }
        toJSON() {
            return this.toString();
        }
    }
    Symbol.abiName = 'symbol';
    Symbol.maxPrecision = 18;
    Asset.Symbol = Symbol;
    class SymbolCode {
        static from(value) {
            if (isInstanceOf(value, SymbolCode)) {
                return value;
            }
            if (typeof value === 'string') {
                value = UInt64.from(toRawSymbolCode(value));
            }
            return new this(UInt64.from(value));
        }
        static fromABI(decoder) {
            return new SymbolCode(UInt64.fromABI(decoder));
        }
        static abiDefault() {
            return this.from('SYS'); // CORE_SYMBOL_NAME
        }
        constructor(value) {
            if (!value.equals(0) && !SymbolCode.pattern.test(toSymbolName(value))) {
                throw new Error('Invalid asset symbol, name must be uppercase A-Z');
            }
            this.value = value;
        }
        equals(other) {
            return this.value.equals(SymbolCode.from(other).value);
        }
        toABI(encoder) {
            this.value.toABI(encoder);
        }
        toString() {
            return charsToSymbolName(this.value.value.toArray('be'));
        }
        toJSON() {
            return this.toString();
        }
    }
    SymbolCode.abiName = 'symbol_code';
    SymbolCode.pattern = /^[A-Z]{0,7}$/;
    Asset.SymbolCode = SymbolCode;
})(Asset || (Asset = {}));
class ExtendedAsset {
    static from(value) {
        if (isInstanceOf(value, ExtendedAsset)) {
            return value;
        }
        return new this(Asset.from(value.quantity), Name.from(value.contract));
    }
    static fromABI(decoder) {
        return new ExtendedAsset(Asset.fromABI(decoder), Name.fromABI(decoder));
    }
    constructor(quantity, contract) {
        this.quantity = quantity;
        this.contract = contract;
    }
    equals(other) {
        return this.quantity.equals(other.quantity) && this.contract.equals(other.contract);
    }
    toABI(encoder) {
        this.quantity.toABI(encoder);
        this.contract.toABI(encoder);
    }
    toJSON() {
        return {
            quantity: this.quantity,
            contract: this.contract,
        };
    }
}
ExtendedAsset.abiName = 'extended_asset';
class ExtendedSymbol {
    static from(value) {
        if (isInstanceOf(value, ExtendedSymbol)) {
            return value;
        }
        return new this(Asset.Symbol.from(value.sym), Name.from(value.contract));
    }
    static fromABI(decoder) {
        return new ExtendedSymbol(Asset.Symbol.fromABI(decoder), Name.fromABI(decoder));
    }
    constructor(sym, contract) {
        this.sym = sym;
        this.contract = contract;
    }
    equals(other) {
        return this.sym.equals(other.sym) && this.contract.equals(other.contract);
    }
    toABI(encoder) {
        this.sym.toABI(encoder);
        this.contract.toABI(encoder);
    }
    toJSON() {
        return {
            sym: this.sym,
            contract: this.contract,
        };
    }
}
ExtendedSymbol.abiName = 'extended_symbol';
function toSymbolPrecision(rawSymbol) {
    return rawSymbol.value.and(UInt64.from(0xff).value).toNumber();
}
function toSymbolName(rawSymbol) {
    const chars = rawSymbol.value.toArray('be').slice(0, -1);
    return charsToSymbolName(chars);
}
function charsToSymbolName(chars) {
    return chars
        .map((char) => String.fromCharCode(char))
        .reverse()
        .join('');
}
function toRawSymbol(name, precision) {
    const code = toRawSymbolCode(name);
    const bytes = new Uint8Array(code.length + 1);
    bytes[0] = precision;
    bytes.set(code, 1);
    return UInt64.from(bytes);
}
function toRawSymbolCode(name) {
    const length = Math.min(name.length, 7);
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = name.charCodeAt(i);
    }
    return bytes;
}

var Base58;
(function (Base58) {
    let ErrorCode;
    (function (ErrorCode) {
        ErrorCode["E_CHECKSUM"] = "E_CHECKSUM";
        ErrorCode["E_INVALID"] = "E_INVALID";
    })(ErrorCode = Base58.ErrorCode || (Base58.ErrorCode = {}));
    class DecodingError extends Error {
        constructor(message, code, info = {}) {
            super(message);
            this.code = code;
            this.info = info;
        }
    }
    DecodingError.__className = 'DecodingError';
    Base58.DecodingError = DecodingError;
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const charMap = new Int16Array(0xff).fill(-1);
    for (let i = 0; i < 58; ++i) {
        charMap[chars.charCodeAt(i)] = i;
    }
    /** Decode a Base58 encoded string. */
    function decode(s, size) {
        if (size == null) {
            return decodeVar(s);
        }
        const result = new Uint8Array(size);
        for (let i = 0; i < s.length; ++i) {
            let carry = charMap[s.charCodeAt(i)];
            if (carry < 0) {
                throw new DecodingError('Invalid Base58 character encountered', ErrorCode.E_INVALID, { char: s[i] });
            }
            for (let j = 0; j < size; ++j) {
                const x = result[j] * 58 + carry;
                result[j] = x;
                carry = x >> 8;
            }
            if (carry) {
                throw new DecodingError('Base58 value is out of range', ErrorCode.E_INVALID);
            }
        }
        result.reverse();
        return new Bytes(result);
    }
    Base58.decode = decode;
    /** Decode a Base58Check encoded string. */
    function decodeCheck(encoded, size) {
        const decoded = decode(encoded, size != null ? size + 4 : size);
        const data = decoded.array.subarray(0, -4);
        const expected = decoded.array.subarray(-4);
        const actual = dsha256Checksum(data);
        if (!arrayEquals(expected, actual)) {
            throw new DecodingError('Checksum mismatch', ErrorCode.E_CHECKSUM, {
                actual,
                expected,
                data,
                hash: 'double_sha256',
            });
        }
        return new Bytes(data);
    }
    Base58.decodeCheck = decodeCheck;
    /** Decode a Base58Check encoded string that uses ripemd160 instead of double sha256 for the digest. */
    function decodeRipemd160Check(encoded, size, suffix) {
        const decoded = decode(encoded, size != null ? size + 4 : size);
        const data = decoded.array.subarray(0, -4);
        const expected = decoded.array.subarray(-4);
        const actual = ripemd160Checksum(data, suffix);
        if (!arrayEquals(expected, actual)) {
            throw new DecodingError('Checksum mismatch', ErrorCode.E_CHECKSUM, {
                actual,
                expected,
                data,
                hash: 'ripemd160',
            });
        }
        return new Bytes(data);
    }
    Base58.decodeRipemd160Check = decodeRipemd160Check;
    /** Encode bytes to a Base58 string.  */
    function encode(data) {
        data = Bytes.from(data);
        const result = [];
        for (const byte of data.array) {
            let carry = byte;
            for (let j = 0; j < result.length; ++j) {
                const x = (charMap[result[j]] << 8) + carry;
                result[j] = chars.charCodeAt(x % 58);
                carry = (x / 58) | 0;
            }
            while (carry) {
                result.push(chars.charCodeAt(carry % 58));
                carry = (carry / 58) | 0;
            }
        }
        for (const byte of data.array) {
            if (byte) {
                break;
            }
            else {
                result.push('1'.charCodeAt(0));
            }
        }
        result.reverse();
        return String.fromCharCode(...result);
    }
    Base58.encode = encode;
    function encodeCheck(data) {
        data = Bytes.from(data);
        data = data.appending(dsha256Checksum(data.array));
        return encode(data);
    }
    Base58.encodeCheck = encodeCheck;
    function encodeRipemd160Check(data, suffix) {
        data = Bytes.from(data);
        data = data.appending(ripemd160Checksum(data.array, suffix));
        return encode(data);
    }
    Base58.encodeRipemd160Check = encodeRipemd160Check;
    /** @internal */
    function decodeVar(s) {
        const result = [];
        for (let i = 0; i < s.length; ++i) {
            let carry = charMap[s.charCodeAt(i)];
            if (carry < 0) {
                throw new DecodingError('Invalid Base58 character encountered', ErrorCode.E_INVALID, { char: s[i] });
            }
            for (let j = 0; j < result.length; ++j) {
                const x = result[j] * 58 + carry;
                result[j] = x & 0xff;
                carry = x >> 8;
            }
            if (carry) {
                result.push(carry);
            }
        }
        for (const ch of s) {
            if (ch === '1') {
                result.push(0);
            }
            else {
                break;
            }
        }
        result.reverse();
        return Bytes.from(result);
    }
    /** @internal */
    function ripemd160Checksum(data, suffix) {
        const hash = ripemd160().update(data);
        if (suffix) {
            hash.update(suffix);
        }
        return new Uint8Array(hash.digest().slice(0, 4));
    }
    /** @internal */
    function dsha256Checksum(data) {
        const round1 = sha256().update(data).digest();
        const round2 = sha256().update(round1).digest();
        return new Uint8Array(round2.slice(0, 4));
    }
})(Base58 || (Base58 = {}));

class PublicKey {
    /** Create PublicKey object from representing types. */
    static from(value) {
        if (isInstanceOf(value, PublicKey)) {
            return value;
        }
        if (typeof value === 'object' && value.type && value.compressed) {
            return new PublicKey(KeyType.from(value.type), new Bytes(value.compressed));
        }
        if (typeof value !== 'string') {
            throw new Error('Invalid public key');
        }
        if (value.startsWith('PUB_')) {
            const parts = value.split('_');
            if (parts.length !== 3) {
                throw new Error('Invalid public key string');
            }
            const type = KeyType.from(parts[1]);
            const size = type === KeyType.K1 || type === KeyType.R1 || type === KeyType.EM ? 33 : undefined;
            const data = Base58.decodeRipemd160Check(parts[2], size, type);
            return new PublicKey(type, data);
        }
        else if (value.length >= 50) {
            // Legacy EOS key
            const data = Base58.decodeRipemd160Check(value.slice(-50));
            return new PublicKey(KeyType.K1, data);
        }
        else {
            throw new Error('Invalid public key string');
        }
    }
    /** @internal */
    static fromABI(decoder) {
        const type = KeyType.from(decoder.readByte());
        if (type == KeyType.WA) {
            const startPos = decoder.getPosition();
            decoder.advance(33); // key_data
            decoder.advance(1); // user presence
            decoder.advance(decoder.readVaruint32()); // rpid
            const len = decoder.getPosition() - startPos;
            decoder.setPosition(startPos);
            const data = Bytes.from(decoder.readArray(len));
            return new PublicKey(KeyType.WA, data);
        }
        return new PublicKey(type, new Bytes(decoder.readArray(33)));
    }
    /** @internal */
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
    equals(other) {
        const otherKey = PublicKey.from(other);
        return this.type === otherKey.type && this.data.equals(otherKey.data);
    }
    /**
     * Return Antelope/EOSIO legacy (`EOS<base58data>`) formatted key.
     * @throws If the key type isn't `K1` or 'EM'.
     */
    toLegacyString(prefix = 'SYS') {
        if (this.type !== KeyType.K1 && this.type !== KeyType.EM) {
            throw new Error('Unable to create legacy formatted string for non-K1/EM key');
        }
        return `${prefix}${Base58.encodeRipemd160Check(this.data)}`;
    }
    /** Return key in modern Antelope/EOSIO format (`PUB_<type>_<base58data>`) */
    toString() {
        return `PUB_${this.type}_${Base58.encodeRipemd160Check(this.data, this.type)}`;
    }
    /** @internal */
    toABI(encoder) {
        encoder.writeByte(KeyType.indexFor(this.type));
        encoder.writeArray(this.data.array);
    }
    /** @internal */
    toJSON() {
        return this.toString();
    }
}
PublicKey.abiName = 'public_key';

const curves = {};
/**
 * Get curve for key type.
 * @internal
 */
function getCurve(type) {
    let rv = curves[type];
    if (!rv) {
        if (type === 'K1' || type === 'EM') {
            rv = curves[type] = new ec('secp256k1');
        }
        else if (type === 'R1') {
            rv = curves[type] = new ec('p256');
        }
        else {
            throw new Error(`Unknown curve type: ${type}`);
        }
    }
    return rv;
}

/**
 * Recover public key from signature and recovery id.
 * @internal
 */
function recover(signature, message, type) {
    const curve = getCurve(type);
    const recid = signature[0] - 31;
    const r = signature.subarray(1, 33);
    const s = signature.subarray(33);
    const point = curve.recoverPubKey(message, { r, s }, recid);
    return new Uint8Array(point.encodeCompressed());
}

/**
 * Verify signature using message and public key.
 * @internal
 */
function verify(signature, message, pubkey, type) {
    const curve = getCurve(type);
    const r = signature.subarray(1, 33);
    const s = signature.subarray(33);
    return curve.verify(message, { r, s }, pubkey);
}

class Signature {
    /** Create Signature object from representing types. */
    static from(value) {
        if (isInstanceOf(value, Signature)) {
            return value;
        }
        if (typeof value === 'object' && value.r && value.s) {
            const data = new Uint8Array(1 + 32 + 32);
            let recid = value.recid;
            const type = KeyType.from(value.type);
            if (value.type === KeyType.K1 ||
                value.type === KeyType.R1 ||
                value.type === KeyType.EM) {
                recid += 31;
            }
            data[0] = recid;
            data.set(value.r, 1);
            data.set(value.s, 33);
            return new Signature(type, new Bytes(data));
        }
        if (typeof value !== 'string') {
            throw new Error('Invalid signature');
        }
        if (value.startsWith('SIG_')) {
            const parts = value.split('_');
            if (parts.length !== 3) {
                throw new Error('Invalid signature string');
            }
            const type = KeyType.from(parts[1]);
            const size = type === KeyType.K1 || type === KeyType.R1 || type === KeyType.EM ? 65 : undefined;
            const data = Base58.decodeRipemd160Check(parts[2], size, type);
            return new Signature(type, data);
        }
        else {
            throw new Error('Invalid signature string');
        }
    }
    /** @internal */
    static fromABI(decoder) {
        const type = KeyType.from(decoder.readByte());
        if (type === KeyType.WA) {
            const startPos = decoder.getPosition();
            decoder.advance(65); // compact_signature
            decoder.advance(decoder.readVaruint32()); // auth_data
            decoder.advance(decoder.readVaruint32()); // client_json
            const len = decoder.getPosition() - startPos;
            decoder.setPosition(startPos);
            const data = Bytes.from(decoder.readArray(len));
            return new Signature(KeyType.WA, data);
        }
        return new Signature(type, new Bytes(decoder.readArray(65)));
    }
    /** @internal */
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }
    equals(other) {
        const otherSig = Signature.from(other);
        return this.type === otherSig.type && this.data.equals(otherSig.data);
    }
    /** Recover public key from given message digest. */
    recoverDigest(digest) {
        digest = Checksum256.from(digest);
        const compressed = recover(this.data.array, digest.array, this.type);
        return PublicKey.from({ compressed, type: this.type });
    }
    /** Recover public key from given message. */
    recoverMessage(message) {
        return this.recoverDigest(Checksum256.hash(message));
    }
    /** Verify this signature with given message digest and public key. */
    verifyDigest(digest, publicKey) {
        digest = Checksum256.from(digest);
        return verify(this.data.array, digest.array, publicKey.data.array, this.type);
    }
    /** Verify this signature with given message and public key. */
    verifyMessage(message, publicKey) {
        return this.verifyDigest(Checksum256.hash(message), publicKey);
    }
    /** Base58check encoded string representation of this signature (`SIG_<type>_<data>`). */
    toString() {
        return `SIG_${this.type}_${Base58.encodeRipemd160Check(this.data, this.type)}`;
    }
    /** @internal */
    toABI(encoder) {
        encoder.writeByte(KeyType.indexFor(this.type));
        encoder.writeArray(this.data.array);
    }
    /** @internal */
    toJSON() {
        return this.toString();
    }
}
Signature.abiName = 'signature';

/**
 * Get public key corresponding to given private key.
 * @internal
 */
function getPublic(privkey, type) {
    const curve = getCurve(type);
    const key = curve.keyFromPrivate(privkey);
    const point = key.getPublic();
    return new Uint8Array(point.encodeCompressed());
}

/**
 * Derive shared secret for key pair.
 * @internal
 */
function sharedSecret(privkey, pubkey, type) {
    const curve = getCurve(type);
    const priv = curve.keyFromPrivate(privkey);
    const pub = curve.keyFromPublic(pubkey).getPublic();
    return priv.derive(pub).toArrayLike(Uint8Array, 'be');
}

/**
 * Sign digest using private key.
 * @internal
 */
function sign(secret, message, type) {
    const curve = getCurve(type);
    const key = curve.keyFromPrivate(secret);
    let sig;
    let r;
    let s;
    if (type === 'K1') {
        let attempt = 1;
        do {
            sig = key.sign(message, { canonical: true, pers: [attempt++] });
            r = sig.r.toArrayLike(Uint8Array, 'be', 32);
            s = sig.s.toArrayLike(Uint8Array, 'be', 32);
        } while (!isCanonical(r, s));
    }
    else {
        sig = key.sign(message, { canonical: true });
        r = sig.r.toArrayLike(Uint8Array, 'be', 32);
        s = sig.s.toArrayLike(Uint8Array, 'be', 32);
    }
    return { type, r, s, recid: sig.recoveryParam || 0 };
}
/**
 * Here be dragons
 * - https://github.com/steemit/steem/issues/1944
 * - https://github.com/EOSIO/eos/issues/6699
 * @internal
 */
function isCanonical(r, s) {
    return (!(r[0] & 0x80) &&
        !(r[0] === 0 && !(r[1] & 0x80)) &&
        !(s[0] & 0x80) &&
        !(s[0] === 0 && !(s[1] & 0x80)));
}

/**
 * Generate a new private key for given type.
 * @internal
 */
function generate(type) {
    const curve = getCurve(type);
    const privkey = curve.genKeyPair().getPrivate();
    return privkey.toArrayLike(Uint8Array, 'be', 32);
}

class PrivateKey {
    /** Create PrivateKey object from representing types. */
    static from(value) {
        if (isInstanceOf(value, PrivateKey)) {
            return value;
        }
        else {
            return this.fromString(value);
        }
    }
    /**
     * Create PrivateKey object from a string representation.
     * Accepts WIF (5...) and Antelope/EOSIO (PVT_...) style private keys.
     */
    static fromString(string, ignoreChecksumError = false) {
        try {
            const { type, data } = decodeKey(string);
            return new this(type, data);
        }
        catch (error) {
            error.message = `Invalid private key (${error.message})`;
            if (ignoreChecksumError &&
                isInstanceOf(error, Base58.DecodingError) &&
                error.code === Base58.ErrorCode.E_CHECKSUM) {
                const type = string.startsWith('PVT_R1')
                    ? KeyType.R1
                    : string.startsWith('PVT_EM')
                        ? KeyType.EM
                        : KeyType.K1;
                const data = new Bytes(error.info.data);
                if (data.length === 33) {
                    data.dropFirst();
                }
                data.zeropad(32, true);
                return new this(type, data);
            }
            throw error;
        }
    }
    /**
     * Generate new PrivateKey.
     * @throws If a secure random source isn't available.
     */
    static generate(type) {
        return new PrivateKey(KeyType.from(type), new Bytes(generate(type)));
    }
    /** @internal */
    constructor(type, data) {
        if ((type === KeyType.K1 || type === KeyType.R1 || type === KeyType.EM) &&
            data.length !== 32) {
            throw new Error('Invalid private key length');
        }
        this.type = type;
        this.data = data;
    }
    /**
     * Sign message digest using this key.
     * @throws If the key type isn't R1 or K1.
     */
    signDigest(digest) {
        digest = Checksum256.from(digest);
        return Signature.from(sign(this.data.array, digest.array, this.type));
    }
    /**
     * Sign message using this key.
     * @throws If the key type isn't R1 or K1.
     */
    signMessage(message) {
        return this.signDigest(Checksum256.hash(message));
    }
    /**
     * Derive the shared secret between this private key and given public key.
     * @throws If the key type isn't R1 or K1.
     */
    sharedSecret(publicKey) {
        const shared = sharedSecret(this.data.array, publicKey.data.array, this.type);
        return Checksum512.hash(shared);
    }
    /**
     * Get the corresponding public key.
     * @throws If the key type isn't R1 or K1.
     */
    toPublic() {
        const compressed = getPublic(this.data.array, this.type);
        return PublicKey.from({ compressed, type: this.type });
    }
    /**
     * Return WIF representation of this private key
     * @throws If the key type isn't K1/EM.
     */
    toWif() {
        if (this.type !== KeyType.K1 && this.type !== KeyType.EM) {
            throw new Error('Unable to generate WIF for non-k1/em key');
        }
        return Base58.encodeCheck(Bytes.from([0x80]).appending(this.data));
    }
    /**
     * Return the key in Antelope/EOSIO PVT_<type>_<base58check> format.
     */
    toString() {
        return `PVT_${this.type}_${Base58.encodeRipemd160Check(this.data, this.type)}`;
    }
    toJSON() {
        return this.toString();
    }
}
/** @internal */
function decodeKey(value) {
    const type = typeof value;
    if (type !== 'string') {
        throw new Error(`Expected string, got ${type}`);
    }
    if (value.startsWith('PVT_')) {
        // Antelope/EOSIO format
        const parts = value.split('_');
        if (parts.length !== 3) {
            throw new Error('Invalid PVT format');
        }
        const type = KeyType.from(parts[1]);
        let size;
        switch (type) {
            case KeyType.K1:
            case KeyType.R1:
            case KeyType.EM:
                size = 32;
                break;
        }
        const data = Base58.decodeRipemd160Check(parts[2], size, type);
        return { type, data };
    }
    else {
        // WIF format
        const type = KeyType.K1;
        const data = Base58.decodeCheck(value);
        if (data.array[0] !== 0x80) {
            throw new Error('Invalid WIF');
        }
        return { type, data: data.droppingFirst() };
    }
}

var PermissionLevel_1;
/** Permission Level, a.k.a "auth". */
let PermissionLevel = PermissionLevel_1 = class PermissionLevel extends Struct {
    /** Create new permission level from representing types. Can be expressed as a string in the format `<actor>@<permission>`. */
    static from(value) {
        if (typeof value === 'string') {
            const parts = value.split('@');
            if (parts.length !== 2 && parts[0].length > 0 && parts[1].length > 0) {
                throw new Error('Invalid permission level string, should be in the format <actor>@<permission>');
            }
            value = { actor: parts[0], permission: parts[1] };
        }
        return super.from(value);
    }
    /** Return true if this permission level equals other. */
    equals(other) {
        const otherPerm = PermissionLevel_1.from(other);
        return this.actor.equals(otherPerm.actor) && this.permission.equals(otherPerm.permission);
    }
    toString() {
        return `${this.actor}@${this.permission}`;
    }
};
__decorate([
    Struct.field('name')
], PermissionLevel.prototype, "actor", void 0);
__decorate([
    Struct.field('name')
], PermissionLevel.prototype, "permission", void 0);
PermissionLevel = PermissionLevel_1 = __decorate([
    Struct.type('permission_level')
], PermissionLevel);

var Action_1;
let Action$1 = Action_1 = class Action extends Struct {
    static from(anyAction, abi) {
        let object = { ...anyAction };
        const data = object.data;
        if (!Bytes.isBytes(data)) {
            let type;
            if (abi) {
                type = ABI.from(abi).getActionType(object.name);
            }
            else if (!data.constructor || data.constructor.abiName === undefined) {
                throw new Error('Missing ABI definition when creating action with untyped action data');
            }
            object = {
                ...object,
                data: abiEncode({ object: data, type, abi }),
            };
        }
        const action = super.from(object);
        if (abi) {
            action.abi = ABI.from(abi);
        }
        else {
            const type = getType(data);
            if (type) {
                action.abi = ABI.from({
                    ...synthesizeABI(type).abi,
                    actions: [
                        {
                            name: action.name,
                            type: type.abiName,
                            ricardian_contract: '',
                        },
                    ],
                });
            }
        }
        return action;
    }
    /** Return true if this Action is equal to given action. */
    equals(other) {
        const otherAction = Action_1.from(other, this.abi);
        return (this.account.equals(otherAction.account) &&
            this.name.equals(otherAction.name) &&
            arrayEquatableEquals(this.authorization, otherAction.authorization) &&
            this.data.equals(otherAction.data));
    }
    decodeData(typeOrAbi) {
        if (typeof typeOrAbi === 'string' || typeOrAbi.abiName) {
            return abiDecode({
                data: this.data,
                type: typeOrAbi,
            });
        }
        else {
            const abi = ABI.from(typeOrAbi);
            const type = abi.getActionType(this.name);
            if (!type) {
                throw new Error(`Action ${this.name} does not exist in provided ABI`);
            }
            return abiDecode({ data: this.data, type, abi });
        }
    }
    get decoded() {
        if (!this.abi) {
            throw new Error('Missing ABI definition when decoding action data');
        }
        return {
            ...this.toJSON(),
            data: this.decodeData(this.abi),
        };
    }
};
__decorate([
    Struct.field('name')
], Action$1.prototype, "account", void 0);
__decorate([
    Struct.field('name')
], Action$1.prototype, "name", void 0);
__decorate([
    Struct.field(PermissionLevel, { array: true })
], Action$1.prototype, "authorization", void 0);
__decorate([
    Struct.field('bytes')
], Action$1.prototype, "data", void 0);
Action$1 = Action_1 = __decorate([
    Struct.type('action')
], Action$1);

var Transaction_1;
let TransactionExtension = class TransactionExtension extends Struct {
};
__decorate([
    Struct.field('uint16')
], TransactionExtension.prototype, "type", void 0);
__decorate([
    Struct.field('bytes')
], TransactionExtension.prototype, "data", void 0);
TransactionExtension = __decorate([
    Struct.type('transaction_extension')
], TransactionExtension);
let TransactionHeader = class TransactionHeader extends Struct {
    static from(object) {
        return super.from({
            max_net_usage_words: 0,
            max_cpu_usage_ms: 0,
            delay_sec: 0,
            ...object,
        });
    }
};
__decorate([
    Struct.field('time_point_sec')
], TransactionHeader.prototype, "expiration", void 0);
__decorate([
    Struct.field('uint16')
], TransactionHeader.prototype, "ref_block_num", void 0);
__decorate([
    Struct.field('uint32')
], TransactionHeader.prototype, "ref_block_prefix", void 0);
__decorate([
    Struct.field('varuint32')
], TransactionHeader.prototype, "max_net_usage_words", void 0);
__decorate([
    Struct.field('uint8')
], TransactionHeader.prototype, "max_cpu_usage_ms", void 0);
__decorate([
    Struct.field('varuint32')
], TransactionHeader.prototype, "delay_sec", void 0);
TransactionHeader = __decorate([
    Struct.type('transaction_header')
], TransactionHeader);
let Transaction = Transaction_1 = class Transaction extends TransactionHeader {
    static from(object, abis) {
        const abiFor = (contract) => {
            if (!abis) {
                return;
            }
            else if (Array.isArray(abis)) {
                return abis
                    .filter((abi) => Name.from(abi.contract).equals(contract))
                    .map(({ abi }) => abi)[0];
            }
            else {
                return abis;
            }
        };
        const resolveAction = (action) => {
            if (action instanceof Action$1) {
                return action;
            }
            else {
                return Action$1.from(action, abiFor(action.account));
            }
        };
        const actions = (object.actions || []).map(resolveAction);
        const context_free_actions = (object.context_free_actions || []).map(resolveAction);
        const transaction = {
            transaction_extensions: [],
            ...object,
            context_free_actions,
            actions,
        };
        return super.from(transaction);
    }
    /** Return true if this transaction is equal to given transaction. */
    equals(other) {
        const tx = Transaction_1.from(other);
        return this.id.equals(tx.id);
    }
    get id() {
        return Checksum256.hash(abiEncode({ object: this }));
    }
    signingDigest(chainId) {
        const data = this.signingData(chainId);
        return Checksum256.hash(data);
    }
    signingData(chainId) {
        let data = Bytes.from(Checksum256.from(chainId).array);
        data = data.appending(abiEncode({ object: this }));
        data = data.appending(new Uint8Array(32));
        return data;
    }
};
__decorate([
    Struct.field(Action$1, { array: true })
], Transaction.prototype, "context_free_actions", void 0);
__decorate([
    Struct.field(Action$1, { array: true })
], Transaction.prototype, "actions", void 0);
__decorate([
    Struct.field(TransactionExtension, { array: true })
], Transaction.prototype, "transaction_extensions", void 0);
Transaction = Transaction_1 = __decorate([
    Struct.type('transaction')
], Transaction);
let SignedTransaction = class SignedTransaction extends Transaction {
    /** The transaction without the signatures. */
    get transaction() {
        return Transaction.from({
            ...this,
            signatures: undefined,
            context_free_data: undefined,
        });
    }
    get id() {
        return this.transaction.id;
    }
    static from(object) {
        return super.from({
            signatures: [],
            context_free_data: [],
            ...object,
        });
    }
};
__decorate([
    Struct.field('signature[]')
], SignedTransaction.prototype, "signatures", void 0);
__decorate([
    Struct.field('bytes[]')
], SignedTransaction.prototype, "context_free_data", void 0);
SignedTransaction = __decorate([
    Struct.type('signed_transaction')
], SignedTransaction);
// reference: https://github.com/AntelopeIO/leap/blob/339d98eed107b9fd94736988996082c7002fa52a/libraries/chain/include/eosio/chain/transaction.hpp#L131-L134
var CompressionType;
(function (CompressionType) {
    CompressionType[CompressionType["none"] = 0] = "none";
    CompressionType[CompressionType["zlib"] = 1] = "zlib";
})(CompressionType || (CompressionType = {}));
let PackedTransaction = class PackedTransaction extends Struct {
    static from(object) {
        return super.from({
            signatures: [],
            packed_context_free_data: '',
            compression: 0,
            ...object,
        });
    }
    static fromSigned(signed, compression = 1) {
        // Encode data
        let packed_trx = abiEncode({ object: Transaction.from(signed) });
        let packed_context_free_data = abiEncode({
            object: signed.context_free_data,
            type: 'bytes[]',
        });
        switch (compression) {
            case CompressionType.zlib: {
                // compress data
                packed_trx = pako.deflate(packed_trx.array);
                packed_context_free_data = pako.deflate(packed_context_free_data.array);
                break;
            }
            case CompressionType.none: {
                break;
            }
        }
        return this.from({
            compression,
            signatures: signed.signatures,
            packed_context_free_data,
            packed_trx,
        });
    }
    getTransaction() {
        switch (Number(this.compression)) {
            // none
            case CompressionType.none: {
                return abiDecode({ data: this.packed_trx, type: Transaction });
            }
            // zlib compressed
            case CompressionType.zlib: {
                const inflated = pako.inflate(this.packed_trx.array);
                return abiDecode({ data: inflated, type: Transaction });
            }
            default: {
                throw new Error(`Unknown transaction compression ${this.compression}`);
            }
        }
    }
    getSignedTransaction() {
        const transaction = this.getTransaction();
        // TODO: decode context free data
        return SignedTransaction.from({
            ...transaction,
            signatures: this.signatures,
        });
    }
};
__decorate([
    Struct.field('signature[]')
], PackedTransaction.prototype, "signatures", void 0);
__decorate([
    Struct.field('uint8')
], PackedTransaction.prototype, "compression", void 0);
__decorate([
    Struct.field('bytes')
], PackedTransaction.prototype, "packed_context_free_data", void 0);
__decorate([
    Struct.field('bytes')
], PackedTransaction.prototype, "packed_trx", void 0);
PackedTransaction = __decorate([
    Struct.type('packed_transaction')
], PackedTransaction);
let TransactionReceipt = class TransactionReceipt extends Struct {
};
__decorate([
    Struct.field('string')
], TransactionReceipt.prototype, "status", void 0);
__decorate([
    Struct.field('uint32')
], TransactionReceipt.prototype, "cpu_usage_us", void 0);
__decorate([
    Struct.field('uint32')
], TransactionReceipt.prototype, "net_usage_words", void 0);
TransactionReceipt = __decorate([
    Struct.type('transaction_receipt')
], TransactionReceipt);

var Authority_1;
let Weight = class Weight extends UInt16 {
};
Weight = __decorate([
    TypeAlias('weight_type')
], Weight);
let KeyWeight = class KeyWeight extends Struct {
};
__decorate([
    Struct.field(PublicKey)
], KeyWeight.prototype, "key", void 0);
__decorate([
    Struct.field(Weight)
], KeyWeight.prototype, "weight", void 0);
KeyWeight = __decorate([
    Struct.type('key_weight')
], KeyWeight);
let PermissionLevelWeight = class PermissionLevelWeight extends Struct {
};
__decorate([
    Struct.field(PermissionLevel)
], PermissionLevelWeight.prototype, "permission", void 0);
__decorate([
    Struct.field(Weight)
], PermissionLevelWeight.prototype, "weight", void 0);
PermissionLevelWeight = __decorate([
    Struct.type('permission_level_weight')
], PermissionLevelWeight);
let WaitWeight = class WaitWeight extends Struct {
};
__decorate([
    Struct.field(UInt32)
], WaitWeight.prototype, "wait_sec", void 0);
__decorate([
    Struct.field(Weight)
], WaitWeight.prototype, "weight", void 0);
WaitWeight = __decorate([
    Struct.type('wait_weight')
], WaitWeight);
let Authority = Authority_1 = class Authority extends Struct {
    static from(value) {
        if (isInstanceOf(value, Authority_1)) {
            return value;
        }
        const rv = super.from({
            keys: [],
            accounts: [],
            waits: [],
            ...value,
        });
        rv.sort();
        return rv;
    }
    /** Total weight of all waits. */
    get waitThreshold() {
        return this.waits.reduce((val, wait) => val + wait.weight.toNumber(), 0);
    }
    /** Weight a key needs to sign for this authority. */
    get keyThreshold() {
        return this.threshold.toNumber() - this.waitThreshold;
    }
    /** Return the weight for given public key, or zero if it is not included in this authority. */
    keyWeight(publicKey) {
        const weight = this.keys.find(({ key }) => key.equals(publicKey));
        return weight ? weight.weight.toNumber() : 0;
    }
    /**
     * Check if given public key has permission in this authority,
     * @attention Does not take indirect permissions for the key via account weights into account.
     * @param publicKey The key to check.
     * @param includePartial Whether to consider auths where the key is included but can't be reached alone (e.g. multisig).
     */
    hasPermission(publicKey, includePartial = false) {
        const threshold = includePartial ? 1 : this.keyThreshold;
        const weight = this.keyWeight(publicKey);
        return weight >= threshold;
    }
    /**
     * Sorts the authority weights in place, should be called before including the authority in a `updateauth` action or it might be rejected.
     */
    sort() {
        this.keys.sort((a, b) => String(a.key).localeCompare(String(b.key)));
        this.accounts.sort((a, b) => String(a.permission).localeCompare(String(b.permission)));
        this.waits.sort((a, b) => String(a.wait_sec).localeCompare(String(b.wait_sec)));
    }
};
__decorate([
    Struct.field(UInt32)
], Authority.prototype, "threshold", void 0);
__decorate([
    Struct.field(KeyWeight, { array: true })
], Authority.prototype, "keys", void 0);
__decorate([
    Struct.field(PermissionLevelWeight, { array: true })
], Authority.prototype, "accounts", void 0);
__decorate([
    Struct.field(WaitWeight, { array: true })
], Authority.prototype, "waits", void 0);
Authority = Authority_1 = __decorate([
    Struct.type('authority')
], Authority);

class BlockId {
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (Bytes.isBytes(value)) {
            return new this(Bytes.from(value).array);
        }
        else {
            return this.fromBlockChecksum(value.checksum, value.blockNum);
        }
    }
    static fromABI(decoder) {
        return new this(decoder.readArray(32));
    }
    static fromBlockChecksum(checksum, blockNum) {
        const id = new BlockId(Checksum256.from(checksum).array);
        const numBuffer = new Uint8Array(4);
        numBuffer[0] = (Number(blockNum) >> 24) & 0xff;
        numBuffer[1] = (Number(blockNum) >> 16) & 0xff;
        numBuffer[2] = (Number(blockNum) >> 8) & 0xff;
        numBuffer[3] = Number(blockNum) & 0xff;
        id.array.set(numBuffer, 0);
        return id;
    }
    constructor(array) {
        if (array.byteLength !== 32) {
            throw new Error(`BlockId size mismatch, expected 32 bytes got ${array.byteLength}`);
        }
        this.array = array;
    }
    equals(other) {
        const self = this.constructor;
        try {
            return arrayEquals(this.array, self.from(other).array);
        }
        catch {
            return false;
        }
    }
    toABI(encoder) {
        encoder.writeArray(this.array);
    }
    toString() {
        return this.hexString;
    }
    toJSON() {
        return this.toString();
    }
    get hexString() {
        return arrayToHex(this.array);
    }
    get blockNum() {
        const bytes = this.array.slice(0, 4);
        let num = 0;
        for (let i = 0; i < 4; i++) {
            num = (num << 8) + bytes[i];
        }
        return UInt32.from(num);
    }
}
BlockId.abiName = 'block_id_type'; // eosio contract context defines this with a _type suffix for some reason

var Serializer;
(function (Serializer) {
    Serializer.encode = abiEncode;
    Serializer.decode = abiDecode;
    /** Create an Antelope/EOSIO ABI definition for given core type. */
    function synthesize(type) {
        return synthesizeABI(type).abi;
    }
    Serializer.synthesize = synthesize;
    /** Create JSON representation of a core object. */
    function stringify(object) {
        return JSON.stringify(object);
    }
    Serializer.stringify = stringify;
    /** Create a vanilla js representation of a core object. */
    function objectify(object) {
        const walk = (v) => {
            switch (typeof v) {
                case 'boolean':
                case 'number':
                case 'string':
                    return v;
                case 'object': {
                    if (v === null) {
                        return v;
                    }
                    if (typeof v.toJSON === 'function') {
                        return walk(v.toJSON());
                    }
                    if (Array.isArray(v)) {
                        return v.map(walk);
                    }
                    const rv = {};
                    for (const key of Object.keys(v)) {
                        rv[key] = walk(v[key]);
                    }
                    return rv;
                }
            }
        };
        return walk(object);
    }
    Serializer.objectify = objectify;
})(Serializer || (Serializer = {}));

/** Default provider that uses the Fetch API to call a single node. */
class FetchProvider {
    constructor(url, options = {}) {
        this.headers = {};
        url = url.trim();
        if (url.endsWith('/'))
            url = url.slice(0, -1);
        this.url = url;
        if (options.headers) {
            this.headers = options.headers;
        }
        if (!options.fetch) {
            if (typeof window !== 'undefined' && window.fetch) {
                this.fetch = window.fetch.bind(window);
            }
            else if (typeof global !== 'undefined' && global.fetch) {
                this.fetch = global.fetch.bind(global);
            }
            else {
                throw new Error('Missing fetch');
            }
        }
        else {
            this.fetch = options.fetch;
        }
    }
    async call(args) {
        const method = args.method || 'POST';
        let url = this.url + args.path;
        const headers = { ...this.headers, ...args.headers };
        // Filter out undefined, null, and empty string values
        const params = args.params
            ? Object.entries(args.params)
                .filter(([_, value]) => value != null && value !== '')
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
            : {};
        let body;
        // If GET method, convert params to query string
        if (method === 'GET' && Object.keys(params).length > 0) {
            url += '?' + new URLSearchParams(params).toString();
        }
        else if (Object.keys(params).length > 0) {
            body = JSON.stringify(params);
        }
        const response = await this.fetch(url, {
            method,
            body: method === 'GET' ? undefined : body,
            headers,
        });
        const text = await response.text();
        let json;
        try {
            json = JSON.parse(text);
        }
        catch {
            // Ignore JSON parse errors
        }
        return { headers: Object.fromEntries(response.headers.entries()), status: response.status, json, text };
    }
}

var TransactionTrace_1;
let AccountLinkedAction = class AccountLinkedAction extends Struct {
};
__decorate([
    Struct.field('name')
], AccountLinkedAction.prototype, "account", void 0);
__decorate([
    Struct.field('name', { optional: true })
], AccountLinkedAction.prototype, "action", void 0);
AccountLinkedAction = __decorate([
    Struct.type('account_linked_action')
], AccountLinkedAction);
let AccountPermission = class AccountPermission extends Struct {
};
__decorate([
    Struct.field('name')
], AccountPermission.prototype, "perm_name", void 0);
__decorate([
    Struct.field('name')
], AccountPermission.prototype, "parent", void 0);
__decorate([
    Struct.field(Authority)
], AccountPermission.prototype, "required_auth", void 0);
__decorate([
    Struct.field(AccountLinkedAction, { optional: true, array: true })
], AccountPermission.prototype, "linked_actions", void 0);
AccountPermission = __decorate([
    Struct.type('account_permission')
], AccountPermission);
let AccountResourceLimit = class AccountResourceLimit extends Struct {
};
__decorate([
    Struct.field('int64')
], AccountResourceLimit.prototype, "used", void 0);
__decorate([
    Struct.field('int64')
], AccountResourceLimit.prototype, "available", void 0);
__decorate([
    Struct.field('int64')
], AccountResourceLimit.prototype, "max", void 0);
__decorate([
    Struct.field('time_point', { optional: true })
], AccountResourceLimit.prototype, "last_usage_update_time", void 0);
__decorate([
    Struct.field('int64', { optional: true })
], AccountResourceLimit.prototype, "current_used", void 0);
AccountResourceLimit = __decorate([
    Struct.type('account_resource_limit')
], AccountResourceLimit);
let AccountTotalResources = class AccountTotalResources extends Struct {
};
__decorate([
    Struct.field('name')
], AccountTotalResources.prototype, "owner", void 0);
__decorate([
    Struct.field('asset')
], AccountTotalResources.prototype, "net_weight", void 0);
__decorate([
    Struct.field('asset')
], AccountTotalResources.prototype, "cpu_weight", void 0);
__decorate([
    Struct.field('uint64')
], AccountTotalResources.prototype, "ram_bytes", void 0);
AccountTotalResources = __decorate([
    Struct.type('account_total_resources')
], AccountTotalResources);
let AccountSelfDelegatedBandwidth = class AccountSelfDelegatedBandwidth extends Struct {
};
__decorate([
    Struct.field('name')
], AccountSelfDelegatedBandwidth.prototype, "from", void 0);
__decorate([
    Struct.field('name')
], AccountSelfDelegatedBandwidth.prototype, "to", void 0);
__decorate([
    Struct.field('asset')
], AccountSelfDelegatedBandwidth.prototype, "net_weight", void 0);
__decorate([
    Struct.field('asset')
], AccountSelfDelegatedBandwidth.prototype, "cpu_weight", void 0);
AccountSelfDelegatedBandwidth = __decorate([
    Struct.type('account_self_delegated_bandwidth')
], AccountSelfDelegatedBandwidth);
let AccountRefundRequest = class AccountRefundRequest extends Struct {
};
__decorate([
    Struct.field('name')
], AccountRefundRequest.prototype, "owner", void 0);
__decorate([
    Struct.field('time_point')
], AccountRefundRequest.prototype, "request_time", void 0);
__decorate([
    Struct.field('asset')
], AccountRefundRequest.prototype, "net_amount", void 0);
__decorate([
    Struct.field('asset')
], AccountRefundRequest.prototype, "cpu_amount", void 0);
AccountRefundRequest = __decorate([
    Struct.type('account_refund_request')
], AccountRefundRequest);
let AccountVoterInfo = class AccountVoterInfo extends Struct {
};
__decorate([
    Struct.field('name')
], AccountVoterInfo.prototype, "owner", void 0);
__decorate([
    Struct.field('name')
], AccountVoterInfo.prototype, "proxy", void 0);
__decorate([
    Struct.field('name', { array: true })
], AccountVoterInfo.prototype, "producers", void 0);
__decorate([
    Struct.field('int64', { optional: true })
], AccountVoterInfo.prototype, "staked", void 0);
__decorate([
    Struct.field('float64')
], AccountVoterInfo.prototype, "last_vote_weight", void 0);
__decorate([
    Struct.field('float64')
], AccountVoterInfo.prototype, "proxied_vote_weight", void 0);
__decorate([
    Struct.field('bool')
], AccountVoterInfo.prototype, "is_proxy", void 0);
__decorate([
    Struct.field('uint32', { optional: true })
], AccountVoterInfo.prototype, "flags1", void 0);
__decorate([
    Struct.field('uint32')
], AccountVoterInfo.prototype, "reserved2", void 0);
__decorate([
    Struct.field('string')
], AccountVoterInfo.prototype, "reserved3", void 0);
AccountVoterInfo = __decorate([
    Struct.type('account_voter_info')
], AccountVoterInfo);
let AccountRexInfoMaturities = class AccountRexInfoMaturities extends Struct {
};
__decorate([
    Struct.field('time_point', { optional: true })
], AccountRexInfoMaturities.prototype, "key", void 0);
__decorate([
    Struct.field('int64', { optional: true })
], AccountRexInfoMaturities.prototype, "value", void 0);
__decorate([
    Struct.field('time_point', { optional: true })
], AccountRexInfoMaturities.prototype, "first", void 0);
__decorate([
    Struct.field('int64', { optional: true })
], AccountRexInfoMaturities.prototype, "second", void 0);
AccountRexInfoMaturities = __decorate([
    Struct.type('account_rex_info_maturities')
], AccountRexInfoMaturities);
let AccountRexInfo = class AccountRexInfo extends Struct {
};
__decorate([
    Struct.field('uint32')
], AccountRexInfo.prototype, "version", void 0);
__decorate([
    Struct.field('name')
], AccountRexInfo.prototype, "owner", void 0);
__decorate([
    Struct.field('asset')
], AccountRexInfo.prototype, "vote_stake", void 0);
__decorate([
    Struct.field('asset')
], AccountRexInfo.prototype, "rex_balance", void 0);
__decorate([
    Struct.field('int64')
], AccountRexInfo.prototype, "matured_rex", void 0);
__decorate([
    Struct.field(AccountRexInfoMaturities, { array: true })
], AccountRexInfo.prototype, "rex_maturities", void 0);
AccountRexInfo = __decorate([
    Struct.type('account_rex_info')
], AccountRexInfo);
let GetRawAbiResponse = class GetRawAbiResponse extends Struct {
};
__decorate([
    Struct.field('name')
], GetRawAbiResponse.prototype, "account_name", void 0);
__decorate([
    Struct.field('checksum256')
], GetRawAbiResponse.prototype, "code_hash", void 0);
__decorate([
    Struct.field('checksum256')
], GetRawAbiResponse.prototype, "abi_hash", void 0);
__decorate([
    Struct.field(Blob)
], GetRawAbiResponse.prototype, "abi", void 0);
GetRawAbiResponse = __decorate([
    Struct.type('get_raw_abi_response')
], GetRawAbiResponse);
let AccountObject = class AccountObject extends Struct {
    getPermission(permission) {
        const name = Name.from(permission);
        const match = this.permissions.find((p) => p.perm_name.equals(name));
        if (!match) {
            throw new Error(`Unknown permission ${name} on account ${this.account_name}.`);
        }
        return match;
    }
};
__decorate([
    Struct.field('name')
], AccountObject.prototype, "account_name", void 0);
__decorate([
    Struct.field('uint32')
], AccountObject.prototype, "head_block_num", void 0);
__decorate([
    Struct.field('time_point')
], AccountObject.prototype, "head_block_time", void 0);
__decorate([
    Struct.field('bool')
], AccountObject.prototype, "privileged", void 0);
__decorate([
    Struct.field('time_point')
], AccountObject.prototype, "last_code_update", void 0);
__decorate([
    Struct.field('time_point')
], AccountObject.prototype, "created", void 0);
__decorate([
    Struct.field('asset?')
], AccountObject.prototype, "core_liquid_balance", void 0);
__decorate([
    Struct.field('int64')
], AccountObject.prototype, "ram_quota", void 0);
__decorate([
    Struct.field('int64')
], AccountObject.prototype, "net_weight", void 0);
__decorate([
    Struct.field('int64')
], AccountObject.prototype, "cpu_weight", void 0);
__decorate([
    Struct.field(AccountResourceLimit)
], AccountObject.prototype, "net_limit", void 0);
__decorate([
    Struct.field(AccountResourceLimit)
], AccountObject.prototype, "cpu_limit", void 0);
__decorate([
    Struct.field(AccountResourceLimit, { optional: true })
], AccountObject.prototype, "subjective_cpu_bill_limit", void 0);
__decorate([
    Struct.field('uint64')
], AccountObject.prototype, "ram_usage", void 0);
__decorate([
    Struct.field(AccountPermission, { array: true })
], AccountObject.prototype, "permissions", void 0);
__decorate([
    Struct.field(AccountTotalResources, { optional: true })
], AccountObject.prototype, "total_resources", void 0);
__decorate([
    Struct.field(AccountSelfDelegatedBandwidth, { optional: true })
], AccountObject.prototype, "self_delegated_bandwidth", void 0);
__decorate([
    Struct.field(AccountRefundRequest, { optional: true })
], AccountObject.prototype, "refund_request", void 0);
__decorate([
    Struct.field(AccountVoterInfo, { optional: true })
], AccountObject.prototype, "voter_info", void 0);
__decorate([
    Struct.field(AccountRexInfo, { optional: true })
], AccountObject.prototype, "rex_info", void 0);
AccountObject = __decorate([
    Struct.type('account_object')
], AccountObject);
let AccountByAuthorizersRow = class AccountByAuthorizersRow extends Struct {
};
__decorate([
    Struct.field(Name)
], AccountByAuthorizersRow.prototype, "account_name", void 0);
__decorate([
    Struct.field(Name)
], AccountByAuthorizersRow.prototype, "permission_name", void 0);
__decorate([
    Struct.field(PublicKey, { optional: true })
], AccountByAuthorizersRow.prototype, "authorizing_key", void 0);
__decorate([
    Struct.field(PermissionLevel, { optional: true })
], AccountByAuthorizersRow.prototype, "authorizing_account", void 0);
__decorate([
    Struct.field(Weight)
], AccountByAuthorizersRow.prototype, "weight", void 0);
__decorate([
    Struct.field(UInt32)
], AccountByAuthorizersRow.prototype, "threshold", void 0);
AccountByAuthorizersRow = __decorate([
    Struct.type('account_by_authorizers_row')
], AccountByAuthorizersRow);
let AccountsByAuthorizers = class AccountsByAuthorizers extends Struct {
};
__decorate([
    Struct.field(AccountByAuthorizersRow, { array: true })
], AccountsByAuthorizers.prototype, "accounts", void 0);
AccountsByAuthorizers = __decorate([
    Struct.type('account_by_authorizers')
], AccountsByAuthorizers);
let NewProducersEntry$1 = class NewProducersEntry extends Struct {
};
__decorate([
    Struct.field('name')
], NewProducersEntry$1.prototype, "producer_name", void 0);
__decorate([
    Struct.field('public_key')
], NewProducersEntry$1.prototype, "block_signing_key", void 0);
NewProducersEntry$1 = __decorate([
    Struct.type('new_producers_entry')
], NewProducersEntry$1);
let NewProducers$1 = class NewProducers extends Struct {
};
__decorate([
    Struct.field('uint32')
], NewProducers$1.prototype, "version", void 0);
__decorate([
    Struct.field(NewProducersEntry$1, { array: true })
], NewProducers$1.prototype, "producers", void 0);
NewProducers$1 = __decorate([
    Struct.type('new_producers')
], NewProducers$1);
let BlockExtension$1 = class BlockExtension extends Struct {
};
__decorate([
    Struct.field('uint16')
], BlockExtension$1.prototype, "type", void 0);
__decorate([
    Struct.field('bytes')
], BlockExtension$1.prototype, "data", void 0);
BlockExtension$1 = __decorate([
    Struct.type('block_extension')
], BlockExtension$1);
let HeaderExtension$1 = class HeaderExtension extends Struct {
};
__decorate([
    Struct.field('uint16')
], HeaderExtension$1.prototype, "type", void 0);
__decorate([
    Struct.field('bytes')
], HeaderExtension$1.prototype, "data", void 0);
HeaderExtension$1 = __decorate([
    Struct.type('header_extension')
], HeaderExtension$1);
// fc "mutable variant" returned by get_block api
let TrxVariant$1 = class TrxVariant {
    static from(data) {
        let id;
        let extra;
        if (typeof data === 'string') {
            id = Checksum256.from(data);
            extra = {};
        }
        else {
            id = Checksum256.from(data.id);
            extra = data;
        }
        return new this(id, extra);
    }
    constructor(id, extra) {
        this.id = id;
        this.extra = extra;
    }
    get transaction() {
        if (this.extra.packed_trx) {
            switch (this.extra.compression) {
                case 'zlib': {
                    const inflated = pako.inflate(Bytes.from(this.extra.packed_trx, 'hex').array);
                    return Serializer.decode({ data: inflated, type: Transaction });
                }
                case 'none': {
                    return Serializer.decode({
                        data: this.extra.packed_trx,
                        type: Transaction,
                    });
                }
                default: {
                    throw new Error(`Unsupported compression type ${this.extra.compression}`);
                }
            }
        }
    }
    get signatures() {
        if (this.extra.signatures) {
            return this.extra.signatures.map(Signature.from);
        }
    }
    equals(other) {
        return this.id.equals(other.id);
    }
    toJSON() {
        return this.id;
    }
};
TrxVariant$1.abiName = 'trx_variant';
let GetBlockResponseTransactionReceipt = class GetBlockResponseTransactionReceipt extends TransactionReceipt {
    get id() {
        return this.trx.id;
    }
};
__decorate([
    Struct.field(TrxVariant$1)
], GetBlockResponseTransactionReceipt.prototype, "trx", void 0);
GetBlockResponseTransactionReceipt = __decorate([
    Struct.type('get_block_response_receipt')
], GetBlockResponseTransactionReceipt);
let GetBlockResponse = class GetBlockResponse extends Struct {
};
__decorate([
    Struct.field('time_point')
], GetBlockResponse.prototype, "timestamp", void 0);
__decorate([
    Struct.field('name')
], GetBlockResponse.prototype, "producer", void 0);
__decorate([
    Struct.field('uint16')
], GetBlockResponse.prototype, "confirmed", void 0);
__decorate([
    Struct.field(BlockId)
], GetBlockResponse.prototype, "previous", void 0);
__decorate([
    Struct.field('checksum256')
], GetBlockResponse.prototype, "transaction_mroot", void 0);
__decorate([
    Struct.field('checksum256')
], GetBlockResponse.prototype, "action_mroot", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockResponse.prototype, "schedule_version", void 0);
__decorate([
    Struct.field(NewProducers$1, { optional: true })
], GetBlockResponse.prototype, "new_producers", void 0);
__decorate([
    Struct.field('header_extension', { optional: true })
], GetBlockResponse.prototype, "header_extensions", void 0);
__decorate([
    Struct.field('any', { optional: true })
], GetBlockResponse.prototype, "new_protocol_features", void 0);
__decorate([
    Struct.field('signature')
], GetBlockResponse.prototype, "producer_signature", void 0);
__decorate([
    Struct.field(GetBlockResponseTransactionReceipt, { array: true })
], GetBlockResponse.prototype, "transactions", void 0);
__decorate([
    Struct.field('block_extension', { optional: true })
], GetBlockResponse.prototype, "block_extensions", void 0);
__decorate([
    Struct.field(BlockId)
], GetBlockResponse.prototype, "id", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockResponse.prototype, "block_num", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockResponse.prototype, "ref_block_prefix", void 0);
GetBlockResponse = __decorate([
    Struct.type('get_block_response')
], GetBlockResponse);
let GetBlockInfoResponse = class GetBlockInfoResponse extends Struct {
};
__decorate([
    Struct.field('uint32')
], GetBlockInfoResponse.prototype, "block_num", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockInfoResponse.prototype, "ref_block_num", void 0);
__decorate([
    Struct.field(BlockId)
], GetBlockInfoResponse.prototype, "id", void 0);
__decorate([
    Struct.field('time_point')
], GetBlockInfoResponse.prototype, "timestamp", void 0);
__decorate([
    Struct.field('name')
], GetBlockInfoResponse.prototype, "producer", void 0);
__decorate([
    Struct.field('uint16')
], GetBlockInfoResponse.prototype, "confirmed", void 0);
__decorate([
    Struct.field(BlockId)
], GetBlockInfoResponse.prototype, "previous", void 0);
__decorate([
    Struct.field('checksum256')
], GetBlockInfoResponse.prototype, "transaction_mroot", void 0);
__decorate([
    Struct.field('checksum256')
], GetBlockInfoResponse.prototype, "action_mroot", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockInfoResponse.prototype, "schedule_version", void 0);
__decorate([
    Struct.field('signature')
], GetBlockInfoResponse.prototype, "producer_signature", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockInfoResponse.prototype, "ref_block_prefix", void 0);
GetBlockInfoResponse = __decorate([
    Struct.type('get_block_response')
], GetBlockInfoResponse);
let ActiveScheduleProducerAuthority = class ActiveScheduleProducerAuthority extends Struct {
};
__decorate([
    Struct.field('name')
], ActiveScheduleProducerAuthority.prototype, "producer_name", void 0);
__decorate([
    Struct.field('any')
], ActiveScheduleProducerAuthority.prototype, "authority", void 0);
ActiveScheduleProducerAuthority = __decorate([
    Struct.type('active_schedule_producer_authority')
], ActiveScheduleProducerAuthority);
let ActiveScheduleProducer = class ActiveScheduleProducer extends Struct {
};
__decorate([
    Struct.field('name')
], ActiveScheduleProducer.prototype, "producer_name", void 0);
__decorate([
    Struct.field(ActiveScheduleProducerAuthority)
], ActiveScheduleProducer.prototype, "authority", void 0);
ActiveScheduleProducer = __decorate([
    Struct.type('active_schedule_producer')
], ActiveScheduleProducer);
let ActiveSchedule = class ActiveSchedule extends Struct {
};
__decorate([
    Struct.field('uint32')
], ActiveSchedule.prototype, "version", void 0);
__decorate([
    Struct.field(ActiveScheduleProducer, { array: true })
], ActiveSchedule.prototype, "producers", void 0);
ActiveSchedule = __decorate([
    Struct.type('active_schedule')
], ActiveSchedule);
let BlockStateHeader = class BlockStateHeader extends Struct {
};
__decorate([
    Struct.field('time_point')
], BlockStateHeader.prototype, "timestamp", void 0);
__decorate([
    Struct.field('name')
], BlockStateHeader.prototype, "producer", void 0);
__decorate([
    Struct.field('uint16')
], BlockStateHeader.prototype, "confirmed", void 0);
__decorate([
    Struct.field(BlockId)
], BlockStateHeader.prototype, "previous", void 0);
__decorate([
    Struct.field('checksum256')
], BlockStateHeader.prototype, "transaction_mroot", void 0);
__decorate([
    Struct.field('checksum256')
], BlockStateHeader.prototype, "action_mroot", void 0);
__decorate([
    Struct.field('uint32')
], BlockStateHeader.prototype, "schedule_version", void 0);
__decorate([
    Struct.field(HeaderExtension$1, { array: true, optional: true })
], BlockStateHeader.prototype, "header_extensions", void 0);
__decorate([
    Struct.field('signature')
], BlockStateHeader.prototype, "producer_signature", void 0);
BlockStateHeader = __decorate([
    Struct.type('block_state_header')
], BlockStateHeader);
let GetBlockHeaderStateResponse = class GetBlockHeaderStateResponse extends Struct {
};
__decorate([
    Struct.field('uint32')
], GetBlockHeaderStateResponse.prototype, "block_num", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockHeaderStateResponse.prototype, "dpos_proposed_irreversible_blocknum", void 0);
__decorate([
    Struct.field('uint32')
], GetBlockHeaderStateResponse.prototype, "dpos_irreversible_blocknum", void 0);
__decorate([
    Struct.field(BlockId)
], GetBlockHeaderStateResponse.prototype, "id", void 0);
__decorate([
    Struct.field(BlockStateHeader)
], GetBlockHeaderStateResponse.prototype, "header", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "active_schedule", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "blockroot_merkle", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "producer_to_last_produced", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "producer_to_last_implied_irb", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "valid_block_signing_authority", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "confirm_count", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "pending_schedule", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "activated_protocol_features", void 0);
__decorate([
    Struct.field('any')
], GetBlockHeaderStateResponse.prototype, "additional_signatures", void 0);
GetBlockHeaderStateResponse = __decorate([
    Struct.type('get_block_header_state_response')
], GetBlockHeaderStateResponse);
let GetInfoResponse = class GetInfoResponse extends Struct {
    getTransactionHeader(secondsAhead = 120) {
        const expiration = TimePointSec.fromMilliseconds(this.head_block_time.toMilliseconds() + secondsAhead * 1000);
        const id = this.last_irreversible_block_id;
        const prefixArray = id.array.subarray(8, 12);
        const prefix = new Uint32Array(prefixArray.buffer, prefixArray.byteOffset, 1)[0];
        return TransactionHeader.from({
            expiration,
            ref_block_num: Number(this.last_irreversible_block_num) & 0xffff,
            ref_block_prefix: prefix,
        });
    }
};
__decorate([
    Struct.field('string')
], GetInfoResponse.prototype, "server_version", void 0);
__decorate([
    Struct.field('checksum256')
], GetInfoResponse.prototype, "chain_id", void 0);
__decorate([
    Struct.field('uint32')
], GetInfoResponse.prototype, "head_block_num", void 0);
__decorate([
    Struct.field('uint32')
], GetInfoResponse.prototype, "last_irreversible_block_num", void 0);
__decorate([
    Struct.field(BlockId)
], GetInfoResponse.prototype, "last_irreversible_block_id", void 0);
__decorate([
    Struct.field(BlockId)
], GetInfoResponse.prototype, "head_block_id", void 0);
__decorate([
    Struct.field('time_point')
], GetInfoResponse.prototype, "head_block_time", void 0);
__decorate([
    Struct.field('name')
], GetInfoResponse.prototype, "head_block_producer", void 0);
__decorate([
    Struct.field('uint64')
], GetInfoResponse.prototype, "virtual_block_cpu_limit", void 0);
__decorate([
    Struct.field('uint64')
], GetInfoResponse.prototype, "virtual_block_net_limit", void 0);
__decorate([
    Struct.field('uint64')
], GetInfoResponse.prototype, "block_cpu_limit", void 0);
__decorate([
    Struct.field('uint64')
], GetInfoResponse.prototype, "block_net_limit", void 0);
__decorate([
    Struct.field('string?')
], GetInfoResponse.prototype, "server_version_string", void 0);
__decorate([
    Struct.field('uint32?')
], GetInfoResponse.prototype, "fork_db_head_block_num", void 0);
__decorate([
    Struct.field('block_id_type?')
], GetInfoResponse.prototype, "fork_db_head_block_id", void 0);
GetInfoResponse = __decorate([
    Struct.type('get_info_response')
], GetInfoResponse);
let GetTableByScopeResponseRow = class GetTableByScopeResponseRow extends Struct {
};
__decorate([
    Struct.field('name')
], GetTableByScopeResponseRow.prototype, "code", void 0);
__decorate([
    Struct.field('name')
], GetTableByScopeResponseRow.prototype, "scope", void 0);
__decorate([
    Struct.field('name')
], GetTableByScopeResponseRow.prototype, "table", void 0);
__decorate([
    Struct.field('name')
], GetTableByScopeResponseRow.prototype, "payer", void 0);
__decorate([
    Struct.field('uint32')
], GetTableByScopeResponseRow.prototype, "count", void 0);
GetTableByScopeResponseRow = __decorate([
    Struct.type('get_table_by_scope_response_row')
], GetTableByScopeResponseRow);
let GetTableByScopeResponse = class GetTableByScopeResponse extends Struct {
};
__decorate([
    Struct.field(GetTableByScopeResponseRow, { array: true })
], GetTableByScopeResponse.prototype, "rows", void 0);
__decorate([
    Struct.field('string')
], GetTableByScopeResponse.prototype, "more", void 0);
GetTableByScopeResponse = __decorate([
    Struct.type('get_table_by_scope_response')
], GetTableByScopeResponse);
let OrderedActionsResult = class OrderedActionsResult extends Struct {
};
__decorate([
    Struct.field(UInt64)
], OrderedActionsResult.prototype, "global_action_seq", void 0);
__decorate([
    Struct.field(Int64)
], OrderedActionsResult.prototype, "account_action_seq", void 0);
__decorate([
    Struct.field(UInt32)
], OrderedActionsResult.prototype, "block_num", void 0);
__decorate([
    Struct.field(BlockTimestamp)
], OrderedActionsResult.prototype, "block_time", void 0);
__decorate([
    Struct.field('any')
], OrderedActionsResult.prototype, "action_trace", void 0);
__decorate([
    Struct.field('boolean?')
], OrderedActionsResult.prototype, "irrevirsible", void 0);
OrderedActionsResult = __decorate([
    Struct.type('ordered_action_result')
], OrderedActionsResult);
let GetActionsResponse$1 = class GetActionsResponse extends Struct {
};
__decorate([
    Struct.field(OrderedActionsResult, { array: true })
], GetActionsResponse$1.prototype, "actions", void 0);
__decorate([
    Struct.field(Int32)
], GetActionsResponse$1.prototype, "last_irreversible_block", void 0);
__decorate([
    Struct.field(Int32)
], GetActionsResponse$1.prototype, "head_block_num", void 0);
__decorate([
    Struct.field('boolean?')
], GetActionsResponse$1.prototype, "time_limit_exceeded_error", void 0);
GetActionsResponse$1 = __decorate([
    Struct.type('get_actions_response')
], GetActionsResponse$1);
let TransactionAuthSequence = class TransactionAuthSequence extends Struct {
};
__decorate([
    Struct.field('string')
], TransactionAuthSequence.prototype, "account", void 0);
__decorate([
    Struct.field('string')
], TransactionAuthSequence.prototype, "sequence", void 0);
TransactionAuthSequence = __decorate([
    Struct.type('transaction_auth_sequence')
], TransactionAuthSequence);
let TransactionTraceReceipt = class TransactionTraceReceipt extends Struct {
};
__decorate([
    Struct.field(Checksum256)
], TransactionTraceReceipt.prototype, "act_digest", void 0);
__decorate([
    Struct.field(TransactionAuthSequence)
], TransactionTraceReceipt.prototype, "auth_sequence", void 0);
__decorate([
    Struct.field('string')
], TransactionTraceReceipt.prototype, "global_sequence", void 0);
__decorate([
    Struct.field('name')
], TransactionTraceReceipt.prototype, "receiver", void 0);
__decorate([
    Struct.field('string')
], TransactionTraceReceipt.prototype, "recv_sequence", void 0);
TransactionTraceReceipt = __decorate([
    Struct.type('transaction_trace_receipt')
], TransactionTraceReceipt);
let TransactionTrace = TransactionTrace_1 = class TransactionTrace extends Struct {
};
__decorate([
    Struct.field('any?')
], TransactionTrace.prototype, "account_ram_deltas", void 0);
__decorate([
    Struct.field(Action$1)
], TransactionTrace.prototype, "act", void 0);
__decorate([
    Struct.field('number')
], TransactionTrace.prototype, "block_num", void 0);
__decorate([
    Struct.field(BlockTimestamp)
], TransactionTrace.prototype, "block_time", void 0);
__decorate([
    Struct.field('string')
], TransactionTrace.prototype, "console", void 0);
__decorate([
    Struct.field('boolean')
], TransactionTrace.prototype, "context_free", void 0);
__decorate([
    Struct.field('number')
], TransactionTrace.prototype, "elapsed", void 0);
__decorate([
    Struct.field('any?')
], TransactionTrace.prototype, "except", void 0);
__decorate([
    Struct.field(TransactionTrace_1)
], TransactionTrace.prototype, "inline_traces", void 0);
__decorate([
    Struct.field(Checksum256)
], TransactionTrace.prototype, "producer_block_id", void 0);
__decorate([
    Struct.field(TransactionTraceReceipt)
], TransactionTrace.prototype, "receipt", void 0);
__decorate([
    Struct.field(Checksum256)
], TransactionTrace.prototype, "trx_id", void 0);
TransactionTrace = TransactionTrace_1 = __decorate([
    Struct.type('transaction_trace')
], TransactionTrace);
let Trx = class Trx extends Struct {
};
__decorate([
    Struct.field('any')
], Trx.prototype, "actions", void 0);
__decorate([
    Struct.field('any')
], Trx.prototype, "context_free_actions", void 0);
__decorate([
    Struct.field('any')
], Trx.prototype, "context_free_data", void 0);
__decorate([
    Struct.field('number')
], Trx.prototype, "delay_sec", void 0);
__decorate([
    Struct.field('string')
], Trx.prototype, "expiration", void 0);
__decorate([
    Struct.field('number')
], Trx.prototype, "max_cpu_usage_ms", void 0);
__decorate([
    Struct.field('number')
], Trx.prototype, "max_net_usage_words", void 0);
__decorate([
    Struct.field('number')
], Trx.prototype, "ref_block_num", void 0);
__decorate([
    Struct.field('number')
], Trx.prototype, "ref_block_prefix", void 0);
__decorate([
    Struct.field('string', { array: true })
], Trx.prototype, "signatures", void 0);
Trx = __decorate([
    Struct.type('trx')
], Trx);
let TransactionInfo = class TransactionInfo extends Struct {
};
__decorate([
    Struct.field(TransactionReceipt)
], TransactionInfo.prototype, "receipt", void 0);
__decorate([
    Struct.field('trx')
], TransactionInfo.prototype, "trx", void 0);
TransactionInfo = __decorate([
    Struct.type('transaction_info')
], TransactionInfo);
let GetTransactionResponse$1 = class GetTransactionResponse extends Struct {
};
__decorate([
    Struct.field(Checksum256)
], GetTransactionResponse$1.prototype, "id", void 0);
__decorate([
    Struct.field(UInt32)
], GetTransactionResponse$1.prototype, "block_num", void 0);
__decorate([
    Struct.field(BlockTimestamp)
], GetTransactionResponse$1.prototype, "block_time", void 0);
__decorate([
    Struct.field(UInt32)
], GetTransactionResponse$1.prototype, "last_irreversible_block", void 0);
__decorate([
    Struct.field('any?')
], GetTransactionResponse$1.prototype, "traces", void 0);
__decorate([
    Struct.field('any')
], GetTransactionResponse$1.prototype, "trx", void 0);
GetTransactionResponse$1 = __decorate([
    Struct.type('get_transaction_response')
], GetTransactionResponse$1);
let GetKeyAccountsResponse = class GetKeyAccountsResponse extends Struct {
};
__decorate([
    Struct.field('name', { array: true })
], GetKeyAccountsResponse.prototype, "account_names", void 0);
GetKeyAccountsResponse = __decorate([
    Struct.type('get_key_accounts_response')
], GetKeyAccountsResponse);
let GetCodeResponse = class GetCodeResponse extends Struct {
};
__decorate([
    Struct.field(ABI)
], GetCodeResponse.prototype, "abi", void 0);
__decorate([
    Struct.field('name')
], GetCodeResponse.prototype, "account_name", void 0);
__decorate([
    Struct.field('checksum256')
], GetCodeResponse.prototype, "code_hash", void 0);
__decorate([
    Struct.field('string')
], GetCodeResponse.prototype, "wast", void 0);
__decorate([
    Struct.field('string')
], GetCodeResponse.prototype, "wasm", void 0);
GetCodeResponse = __decorate([
    Struct.type('get_code_response')
], GetCodeResponse);
let GetControlledAccountsResponse = class GetControlledAccountsResponse extends Struct {
};
__decorate([
    Struct.field('name', { array: true })
], GetControlledAccountsResponse.prototype, "controlled_accounts", void 0);
GetControlledAccountsResponse = __decorate([
    Struct.type('get_controlled_accounts_response')
], GetControlledAccountsResponse);
let GetCurrencyStatsItemResponse = class GetCurrencyStatsItemResponse extends Struct {
};
__decorate([
    Struct.field('asset')
], GetCurrencyStatsItemResponse.prototype, "supply", void 0);
__decorate([
    Struct.field('asset')
], GetCurrencyStatsItemResponse.prototype, "max_supply", void 0);
__decorate([
    Struct.field('name')
], GetCurrencyStatsItemResponse.prototype, "issuer", void 0);
GetCurrencyStatsItemResponse = __decorate([
    Struct.type('get_currency_stats_item_response')
], GetCurrencyStatsItemResponse);
let GetTransactionStatusResponse = class GetTransactionStatusResponse extends Struct {
};
__decorate([
    Struct.field('string')
], GetTransactionStatusResponse.prototype, "state", void 0);
__decorate([
    Struct.field('uint32')
], GetTransactionStatusResponse.prototype, "head_number", void 0);
__decorate([
    Struct.field(BlockId)
], GetTransactionStatusResponse.prototype, "head_id", void 0);
__decorate([
    Struct.field('time_point')
], GetTransactionStatusResponse.prototype, "head_timestamp", void 0);
__decorate([
    Struct.field('uint32')
], GetTransactionStatusResponse.prototype, "irreversible_number", void 0);
__decorate([
    Struct.field(BlockId)
], GetTransactionStatusResponse.prototype, "irreversible_id", void 0);
__decorate([
    Struct.field('time_point')
], GetTransactionStatusResponse.prototype, "irreversible_timestamp", void 0);
__decorate([
    Struct.field(BlockId)
], GetTransactionStatusResponse.prototype, "earliest_tracked_block_id", void 0);
__decorate([
    Struct.field('uint32')
], GetTransactionStatusResponse.prototype, "earliest_tracked_block_number", void 0);
GetTransactionStatusResponse = __decorate([
    Struct.type('get_transaction_status_response')
], GetTransactionStatusResponse);
let ProducerAuthority = class ProducerAuthority extends Struct {
};
__decorate([
    Struct.field(UInt32)
], ProducerAuthority.prototype, "threshold", void 0);
__decorate([
    Struct.field(KeyWeight, { array: true })
], ProducerAuthority.prototype, "keys", void 0);
ProducerAuthority = __decorate([
    Struct.type('producer_authority')
], ProducerAuthority);
let Producer = class Producer extends Struct {
    static from(data) {
        return super.from({
            ...data,
            authority: [data.authority[0], ProducerAuthority.from(data.authority[1])],
        });
    }
};
__decorate([
    Struct.field('name')
], Producer.prototype, "producer_name", void 0);
__decorate([
    Struct.field('any', { array: true })
], Producer.prototype, "authority", void 0);
Producer = __decorate([
    Struct.type('producer')
], Producer);
let ProducerSchedule = class ProducerSchedule extends Struct {
};
__decorate([
    Struct.field('uint32')
], ProducerSchedule.prototype, "version", void 0);
__decorate([
    Struct.field(Producer, { array: true })
], ProducerSchedule.prototype, "producers", void 0);
ProducerSchedule = __decorate([
    Struct.type('producer_schedule')
], ProducerSchedule);
let GetProducerScheduleResponse = class GetProducerScheduleResponse extends Struct {
};
__decorate([
    Struct.field(ProducerSchedule, { optional: true })
], GetProducerScheduleResponse.prototype, "active", void 0);
__decorate([
    Struct.field(ProducerSchedule, { optional: true })
], GetProducerScheduleResponse.prototype, "pending", void 0);
__decorate([
    Struct.field(ProducerSchedule, { optional: true })
], GetProducerScheduleResponse.prototype, "proposed", void 0);
GetProducerScheduleResponse = __decorate([
    Struct.type('get_producer_schedule_response')
], GetProducerScheduleResponse);
let ProtocolFeature = class ProtocolFeature extends Struct {
};
__decorate([
    Struct.field('checksum256')
], ProtocolFeature.prototype, "feature_digest", void 0);
__decorate([
    Struct.field('uint32')
], ProtocolFeature.prototype, "activation_ordinal", void 0);
__decorate([
    Struct.field('uint32')
], ProtocolFeature.prototype, "activation_block_num", void 0);
__decorate([
    Struct.field('checksum256')
], ProtocolFeature.prototype, "description_digest", void 0);
__decorate([
    Struct.field('string', { array: true })
], ProtocolFeature.prototype, "dependencies", void 0);
__decorate([
    Struct.field('string')
], ProtocolFeature.prototype, "protocol_feature_type", void 0);
__decorate([
    Struct.field('any', { array: true })
], ProtocolFeature.prototype, "specification", void 0);
ProtocolFeature = __decorate([
    Struct.type('protocol_feature')
], ProtocolFeature);
let GetProtocolFeaturesResponse = class GetProtocolFeaturesResponse extends Struct {
};
__decorate([
    Struct.field(ProtocolFeature, { array: true })
], GetProtocolFeaturesResponse.prototype, "activated_protocol_features", void 0);
__decorate([
    Struct.field('uint32', { optional: true })
], GetProtocolFeaturesResponse.prototype, "more", void 0);
GetProtocolFeaturesResponse = __decorate([
    Struct.type('get_protocol_features_response')
], GetProtocolFeaturesResponse);

var types$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get AccountByAuthorizersRow () { return AccountByAuthorizersRow; },
    get AccountLinkedAction () { return AccountLinkedAction; },
    get AccountObject () { return AccountObject; },
    get AccountPermission () { return AccountPermission; },
    get AccountRefundRequest () { return AccountRefundRequest; },
    get AccountResourceLimit () { return AccountResourceLimit; },
    get AccountRexInfo () { return AccountRexInfo; },
    get AccountRexInfoMaturities () { return AccountRexInfoMaturities; },
    get AccountSelfDelegatedBandwidth () { return AccountSelfDelegatedBandwidth; },
    get AccountTotalResources () { return AccountTotalResources; },
    get AccountVoterInfo () { return AccountVoterInfo; },
    get AccountsByAuthorizers () { return AccountsByAuthorizers; },
    get ActiveSchedule () { return ActiveSchedule; },
    get ActiveScheduleProducer () { return ActiveScheduleProducer; },
    get ActiveScheduleProducerAuthority () { return ActiveScheduleProducerAuthority; },
    get BlockExtension () { return BlockExtension$1; },
    get BlockStateHeader () { return BlockStateHeader; },
    get GetActionsResponse () { return GetActionsResponse$1; },
    get GetBlockHeaderStateResponse () { return GetBlockHeaderStateResponse; },
    get GetBlockInfoResponse () { return GetBlockInfoResponse; },
    get GetBlockResponse () { return GetBlockResponse; },
    get GetBlockResponseTransactionReceipt () { return GetBlockResponseTransactionReceipt; },
    get GetCodeResponse () { return GetCodeResponse; },
    get GetControlledAccountsResponse () { return GetControlledAccountsResponse; },
    get GetCurrencyStatsItemResponse () { return GetCurrencyStatsItemResponse; },
    get GetInfoResponse () { return GetInfoResponse; },
    get GetKeyAccountsResponse () { return GetKeyAccountsResponse; },
    get GetProducerScheduleResponse () { return GetProducerScheduleResponse; },
    get GetProtocolFeaturesResponse () { return GetProtocolFeaturesResponse; },
    get GetRawAbiResponse () { return GetRawAbiResponse; },
    get GetTableByScopeResponse () { return GetTableByScopeResponse; },
    get GetTableByScopeResponseRow () { return GetTableByScopeResponseRow; },
    get GetTransactionResponse () { return GetTransactionResponse$1; },
    get GetTransactionStatusResponse () { return GetTransactionStatusResponse; },
    get HeaderExtension () { return HeaderExtension$1; },
    get NewProducers () { return NewProducers$1; },
    get NewProducersEntry () { return NewProducersEntry$1; },
    get OrderedActionsResult () { return OrderedActionsResult; },
    get Producer () { return Producer; },
    get ProducerAuthority () { return ProducerAuthority; },
    get ProducerSchedule () { return ProducerSchedule; },
    get ProtocolFeature () { return ProtocolFeature; },
    get TransactionAuthSequence () { return TransactionAuthSequence; },
    get TransactionInfo () { return TransactionInfo; },
    get TransactionTrace () { return TransactionTrace; },
    get TransactionTraceReceipt () { return TransactionTraceReceipt; },
    get Trx () { return Trx; },
    TrxVariant: TrxVariant$1
});

class ChainAPI {
    constructor(client) {
        this.client = client;
    }
    async get_abi(accountName) {
        return this.client.call({
            path: '/v1/chain/get_abi',
            params: { account_name: Name.from(accountName) },
        });
    }
    async get_code(accountName) {
        return this.client.call({
            path: '/v1/chain/get_code',
            params: { account_name: Name.from(accountName) },
            responseType: GetCodeResponse,
        });
    }
    async get_raw_abi(accountName) {
        return this.client.call({
            path: '/v1/chain/get_raw_abi',
            params: { account_name: Name.from(accountName) },
            responseType: GetRawAbiResponse,
        });
    }
    async get_account(accountName, responseType = AccountObject) {
        return this.client.call({
            path: '/v1/chain/get_account',
            params: { account_name: Name.from(accountName) },
            responseType: responseType,
        });
    }
    async get_accounts_by_authorizers(params) {
        return this.client.call({
            path: '/v1/chain/get_accounts_by_authorizers',
            params,
            responseType: AccountsByAuthorizers,
        });
    }
    async get_activated_protocol_features(params) {
        return this.client.call({
            path: '/v1/chain/get_activated_protocol_features',
            params,
            responseType: GetProtocolFeaturesResponse,
        });
    }
    async get_block(block_num_or_id) {
        return this.client.call({
            path: '/v1/chain/get_block',
            params: { block_num_or_id },
            responseType: GetBlockResponse,
        });
    }
    async get_block_header_state(block_num_or_id) {
        return this.client.call({
            path: '/v1/chain/get_block_header_state',
            params: { block_num_or_id },
            responseType: GetBlockHeaderStateResponse,
        });
    }
    async get_block_info(block_num) {
        return this.client.call({
            path: '/v1/chain/get_block_info',
            params: { block_num },
            responseType: GetBlockInfoResponse,
        });
    }
    async get_currency_balance(contract, accountName, symbol) {
        const params = {
            account: Name.from(accountName),
            code: Name.from(contract),
        };
        if (symbol) {
            params.symbol = symbol;
        }
        return this.client.call({
            path: '/v1/chain/get_currency_balance',
            params,
            responseType: 'asset[]',
        });
    }
    async get_currency_stats(contract, symbol) {
        const params = {
            code: Name.from(contract),
            symbol,
        };
        const response = await this.client.call({
            path: '/v1/chain/get_currency_stats',
            params,
        });
        const result = {};
        Object.keys(response).forEach((r) => (result[r] = GetCurrencyStatsItemResponse.from(response[r])));
        return result;
    }
    async get_info() {
        return this.client.call({
            path: '/v1/chain/get_info',
            responseType: GetInfoResponse,
            method: 'GET',
        });
    }
    async get_producer_schedule() {
        return this.client.call({
            path: '/v1/chain/get_producer_schedule',
            responseType: GetProducerScheduleResponse,
        });
    }
    async compute_transaction(tx) {
        if (!isInstanceOf(tx, PackedTransaction)) {
            tx = PackedTransaction.fromSigned(SignedTransaction.from(tx));
        }
        return this.client.call({
            path: '/v1/chain/compute_transaction',
            params: {
                transaction: tx,
            },
        });
    }
    async send_read_only_transaction(tx) {
        if (!isInstanceOf(tx, PackedTransaction)) {
            tx = PackedTransaction.fromSigned(SignedTransaction.from(tx));
        }
        return this.client.call({
            path: '/v1/chain/send_read_only_transaction',
            params: {
                transaction: tx,
            },
        });
    }
    async push_transaction(tx) {
        if (!isInstanceOf(tx, PackedTransaction)) {
            tx = PackedTransaction.fromSigned(SignedTransaction.from(tx));
        }
        return this.client.call({
            path: '/v1/chain/push_transaction',
            params: tx,
        });
    }
    async send_transaction(tx) {
        if (!isInstanceOf(tx, PackedTransaction)) {
            tx = PackedTransaction.fromSigned(SignedTransaction.from(tx));
        }
        return this.client.call({
            path: '/v1/chain/send_transaction',
            params: tx,
        });
    }
    async send_transaction2(tx, options) {
        if (!isInstanceOf(tx, PackedTransaction)) {
            tx = PackedTransaction.fromSigned(SignedTransaction.from(tx));
        }
        return this.client.call({
            path: '/v1/chain/send_transaction2',
            params: {
                return_failure_trace: true,
                retry_trx: false,
                retry_trx_num_blocks: 0,
                transaction: tx,
                ...options,
            },
        });
    }
    async get_table_rows(params) {
        const type = params.type;
        let key_type = params.key_type;
        const someBound = params.lower_bound || params.upper_bound;
        if (!key_type && someBound) {
            // determine key type from bounds type
            if (isInstanceOf(someBound, UInt64)) {
                key_type = 'i64';
            }
            else if (isInstanceOf(someBound, UInt128)) {
                key_type = 'i128';
            }
            else if (isInstanceOf(someBound, Checksum256)) {
                key_type = 'sha256';
            }
            else if (isInstanceOf(someBound, Checksum160)) {
                key_type = 'ripemd160';
            }
        }
        if (!key_type) {
            key_type = 'name';
        }
        let json = params.json;
        if (json === undefined) {
            // if we know the row type don't ask the node to perform abi decoding
            json = type === undefined;
        }
        let upper_bound = params.upper_bound;
        if (upper_bound && typeof upper_bound !== 'string') {
            upper_bound = String(upper_bound);
        }
        let lower_bound = params.lower_bound;
        if (lower_bound && typeof lower_bound !== 'string') {
            lower_bound = String(lower_bound);
        }
        let scope = params.scope;
        if (typeof scope === 'undefined') {
            scope = String(Name.from(params.code));
        }
        else if (typeof scope !== 'string') {
            scope = String(scope);
        }
        // eslint-disable-next-line prefer-const
        let { rows, more, next_key } = await this.client.call({
            path: '/v1/chain/get_table_rows',
            params: {
                ...params,
                code: Name.from(params.code),
                table: Name.from(params.table),
                limit: params.limit !== undefined ? UInt32.from(params.limit) : undefined,
                scope,
                key_type,
                json,
                upper_bound,
                lower_bound,
            },
        });
        let ram_payers;
        if (params.show_payer) {
            ram_payers = [];
            rows = rows.map(({ data, payer }) => {
                ram_payers.push(Name.from(payer));
                return data;
            });
        }
        if (type) {
            if (json) {
                rows = rows.map((value) => {
                    if (typeof value === 'string' && Bytes.isBytes(value)) {
                        // this handles the case where nodeop bails on abi decoding and just returns a hex string
                        return Serializer.decode({ data: Bytes.from(value), type });
                    }
                    else {
                        return Serializer.decode({ object: value, type });
                    }
                });
            }
            else {
                rows = rows
                    .map((hex) => Bytes.from(hex))
                    .map((data) => Serializer.decode({ data, type }));
            }
        }
        if (next_key && next_key.length > 0) {
            let indexType;
            // set index type so we can decode next_key in the response if present
            switch (key_type) {
                case 'i64':
                    indexType = UInt64;
                    break;
                case 'i128':
                    indexType = UInt128;
                    break;
                case 'name':
                    indexType = Name;
                    break;
                case 'float64':
                    indexType = Float64;
                    break;
                case 'float128':
                    indexType = Float128;
                    break;
                case 'sha256':
                    indexType = Checksum256;
                    break;
                case 'ripemd160':
                    indexType = Checksum160;
                    break;
                default:
                    throw new Error(`Unsupported key type: ${key_type}`);
            }
            if (indexType === Name) {
                // names are sent back as an uint64 string instead of a name string..
                next_key = Name.from(Serializer.decode({ object: next_key, type: UInt64 }));
            }
            else {
                next_key = Serializer.decode({ object: next_key, type: indexType });
            }
        }
        else {
            next_key = undefined;
        }
        return { rows, more, next_key, ram_payers };
    }
    async get_table_by_scope(params) {
        return this.client.call({
            path: '/v1/chain/get_table_by_scope',
            params,
            responseType: GetTableByScopeResponse,
        });
    }
    async get_transaction_status(id) {
        return this.client.call({
            path: '/v1/chain/get_transaction_status',
            params: {
                id: Checksum256.from(id),
            },
            responseType: GetTransactionStatusResponse,
        });
    }
}

class HistoryAPI {
    constructor(client) {
        this.client = client;
    }
    async get_actions(accountName, pos, offset) {
        return this.client.call({
            path: '/v1/history/get_actions',
            params: {
                account_name: Name.from(accountName),
                pos: Int32.from(pos),
                offset: Int32.from(offset),
            },
            responseType: GetActionsResponse$1,
        });
    }
    async get_transaction(id, options = {}) {
        return this.client.call({
            path: '/v1/history/get_transaction',
            params: {
                id: Checksum256.from(id),
                block_num_hint: options.blockNumHint && UInt32.from(options.blockNumHint),
                traces: options.excludeTraces === true ? false : undefined,
            },
            responseType: GetTransactionResponse$1,
        });
    }
    async get_key_accounts(publicKey) {
        return this.client.call({
            path: '/v1/history/get_key_accounts',
            params: { public_key: PublicKey.from(publicKey) },
            responseType: GetKeyAccountsResponse,
        });
    }
    async get_controlled_accounts(controllingAccount) {
        return this.client.call({
            path: '/v1/history/get_controlled_accounts',
            params: { controlling_account: Name.from(controllingAccount) },
            responseType: GetControlledAccountsResponse,
        });
    }
}

class HistoryAPIv2 {
    constructor(client) {
        this.client = client;
    }
    /**
     * Fetch a transaction by ID
     * @param id - Transaction ID
     * @param block_hint - Optional block hint for performance
     */
    async get_transaction(id, block_hint) {
        return this.client.call({
            method: 'GET',
            path: '/v2/history/get_transaction',
            params: { id, block_hint }
        });
    }
    /**
     * Fetch actions based on specified parameters
     * @param params - Query parameters for fetching actions
     * @returns A promise that resolves to a GetActionsResponse object
     */
    async get_actions(params) {
        return this.client.call({
            method: 'GET',
            path: `/v2/history/get_actions`,
            params: params || {}
        });
    }
    /**
     * Fetch all accounts created by a specified account
     * @param params - Query parameters for fetching created accounts
     * @returns A promise that resolves to a GetCreatedAccountsResponse object containing an array of CreatedAccounts
     */
    async get_created_accounts(params) {
        return this.client.call({
            method: 'GET',
            path: `/v2/history/get_created_accounts`,
            params
        });
    }
}

class StateAPIv2 {
    constructor(client) {
        this.client = client;
    }
    /**
     * Fetch account details by account name
     * @param account - The name of the account to fetch
     * @param limit - Optional limit for pagination
     * @param skip - Optional skip for pagination
     * @returns A promise that resolves to a GetAccountResponse object
     */
    async get_account(account, limit, skip) {
        return this.client.call({
            method: 'GET',
            path: '/v2/state/get_account',
            params: { account, limit, skip }
        });
    }
}

class StatsAPIv2 {
    constructor(client) {
        this.client = client;
    }
    async health() {
        return this.client.call({
            method: 'GET',
            path: '/v2/health'
        });
    }
    /**
     * Fetch API usage statistics
     * @returns A promise that resolves to an ApiUsageResponse object containing API usage stats
     */
    async get_api_usage() {
        return this.client.call({
            method: 'GET',
            path: '/v2/stats/get_api_usage'
        });
    }
    /**
     * Fetch missed blocks statistics
     * @param params - Query parameters to filter the missed blocks data
     */
    async get_missed_blocks(params) {
        return this.client.call({
            method: 'GET',
            path: '/v2/stats/get_missed_blocks',
            params: params || {}
        });
    }
    /**
     * Fetch resource usage stats for a given contract and action
     * @param params - Query parameters (contract code and action name)
     * @returns A promise that resolves to a GetResourceUsageResponse object
     */
    async get_resource_usage(params) {
        return this.client.call({
            method: 'GET',
            path: '/v2/stats/get_resource_usage',
            params
        });
    }
}

class APIError extends Error {
    static formatError(error) {
        if (error.what === 'unspecified' &&
            error.details[0].file &&
            error.details[0].file === 'http_plugin.cpp' &&
            error.details[0].message.slice(0, 11) === 'unknown key') {
            // fix cryptic error messages from nodeop for missing accounts
            return 'Account not found';
        }
        else if (error.what === 'unspecified' && error.details && error.details.length > 0) {
            return error.details[0].message;
        }
        else if (error.what && error.what.length > 0) {
            return error.what;
        }
        else {
            return 'Unknown API error';
        }
    }
    constructor(path, response) {
        let message;
        if (response.json && response.json.error) {
            message = `${APIError.formatError(response.json.error)} at ${path}`;
        }
        else {
            message = `HTTP ${response.status} at ${path}`;
        }
        super(message);
        this.path = path;
        this.response = response;
    }
    /** The nodeop error object. */
    get error() {
        const { json } = this.response;
        return (json ? json.error : undefined);
    }
    /** The nodeop error name, e.g. `tx_net_usage_exceeded` */
    get name() {
        const { error } = this;
        return error ? error.name : 'unspecified';
    }
    /** The nodeop error code, e.g. `3080002`. */
    get code() {
        const { error } = this;
        return error ? error.code : 0;
    }
    /** List of exceptions, if any. */
    get details() {
        const { error } = this;
        return error ? error.details : [];
    }
}
APIError.__className = 'APIError';
class APIClient {
    constructor(options) {
        this.v1 = {
            chain: new ChainAPI(this),
            history: new HistoryAPI(this),
        };
        this.v2 = {
            history: new HistoryAPIv2(this),
            state: new StateAPIv2(this),
            stats: new StatsAPIv2(this)
        };
        if (options.provider)
            this.v1Provider = options.provider;
        else if (options.url)
            this.v1Provider = new FetchProvider(options.url, options);
        else
            throw new Error('Missing v1 url or provider');
        if (options.hyperionUrl && options.hyperionUrl != '')
            this.v2Provider = new FetchProvider(options.hyperionUrl, options);
    }
    async call(args) {
        const isV2 = args.path.startsWith('/v2/');
        if (isV2 && !this.v2Provider)
            throw new Error('HyperionAPI requires a v2 provider');
        const response = isV2 && this.v2Provider
            ? await this.v2Provider.call(args)
            : await this.v1Provider.call(args);
        const { json } = response;
        if (Math.floor(response.status / 100) !== 2 || (json && typeof json.error === 'object'))
            throw new APIError(args.path, response);
        if (args.responseType)
            return abiDecode({ type: args.responseType, object: response.json });
        return response.json || response.text;
    }
}
APIClient.__className = 'APIClient';

let AccountRamDelta = class AccountRamDelta extends Struct {
};
__decorate([
    Struct.field('string')
], AccountRamDelta.prototype, "account", void 0);
__decorate([
    Struct.field('number')
], AccountRamDelta.prototype, "delta", void 0);
AccountRamDelta = __decorate([
    Struct.type('account_ram_delta')
], AccountRamDelta);
let AuthSequence = class AuthSequence extends Struct {
};
__decorate([
    Struct.field('string')
], AuthSequence.prototype, "account", void 0);
__decorate([
    Struct.field('string')
], AuthSequence.prototype, "sequence", void 0);
AuthSequence = __decorate([
    Struct.type('auth_sequence')
], AuthSequence);
let Receipt = class Receipt extends Struct {
};
__decorate([
    Struct.field('string')
], Receipt.prototype, "receiver", void 0);
__decorate([
    Struct.field('string')
], Receipt.prototype, "global_sequence", void 0);
__decorate([
    Struct.field('string')
], Receipt.prototype, "recv_sequence", void 0);
__decorate([
    Struct.field(AuthSequence, { array: true })
], Receipt.prototype, "auth_sequence", void 0);
Receipt = __decorate([
    Struct.type('receipt')
], Receipt);
let GetTransactionResponseAction = class GetTransactionResponseAction extends Struct {
};
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "action_ordinal", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "creator_action_ordinal", void 0);
__decorate([
    Struct.field('AnyAction')
], GetTransactionResponseAction.prototype, "act", void 0);
__decorate([
    Struct.field(AccountRamDelta, { array: true })
], GetTransactionResponseAction.prototype, "account_ram_deltas", void 0);
__decorate([
    Struct.field(Signature, { array: true })
], GetTransactionResponseAction.prototype, "signatures", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponseAction.prototype, "@timestamp", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "block_num", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponseAction.prototype, "block_id", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponseAction.prototype, "producer", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponseAction.prototype, "trx_id", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "global_sequence", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "cpu_usage_us", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "net_usage_words", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "code_sequence", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponseAction.prototype, "abi_sequence", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponseAction.prototype, "act_digest", void 0);
__decorate([
    Struct.field(Receipt, { array: true })
], GetTransactionResponseAction.prototype, "receipts", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponseAction.prototype, "timestamp", void 0);
GetTransactionResponseAction = __decorate([
    Struct.type('get_transaction_response_action')
], GetTransactionResponseAction);
let GetTransactionResponse = class GetTransactionResponse extends Struct {
};
__decorate([
    Struct.field('number')
], GetTransactionResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('boolean')
], GetTransactionResponse.prototype, "executed", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponse.prototype, "trx_id", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponse.prototype, "lib", void 0);
__decorate([
    Struct.field('boolean')
], GetTransactionResponse.prototype, "cached_lib", void 0);
__decorate([
    Struct.field(GetTransactionResponseAction, { array: true })
], GetTransactionResponse.prototype, "actions", void 0);
__decorate([
    Struct.field('number')
], GetTransactionResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], GetTransactionResponse.prototype, "last_indexed_block_time", void 0);
GetTransactionResponse = __decorate([
    Struct.type('get_transaction_response_v2')
], GetTransactionResponse);
let ActionDataHeader = class ActionDataHeader extends Struct {
};
__decorate([
    Struct.field('number')
], ActionDataHeader.prototype, "timestamp", void 0);
__decorate([
    Struct.field('string')
], ActionDataHeader.prototype, "producer", void 0);
__decorate([
    Struct.field('number')
], ActionDataHeader.prototype, "confirmed", void 0);
__decorate([
    Struct.field('string')
], ActionDataHeader.prototype, "previous", void 0);
__decorate([
    Struct.field('string')
], ActionDataHeader.prototype, "transaction_mroot", void 0);
__decorate([
    Struct.field('string')
], ActionDataHeader.prototype, "action_mroot", void 0);
__decorate([
    Struct.field('number')
], ActionDataHeader.prototype, "schedule_version", void 0);
__decorate([
    Struct.field('any')
], ActionDataHeader.prototype, "new_producers", void 0);
ActionDataHeader = __decorate([
    Struct.type('action_data_header')
], ActionDataHeader);
let ActionObject = class ActionObject extends Struct {
};
__decorate([
    Struct.field('number')
], ActionObject.prototype, "action_ordinal", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "creator_action_ordinal", void 0);
__decorate([
    Struct.field('AnyAction')
], ActionObject.prototype, "act", void 0);
__decorate([
    Struct.field(AccountRamDelta, { array: true })
], ActionObject.prototype, "account_ram_deltas", void 0);
__decorate([
    Struct.field(Signature, { array: true })
], ActionObject.prototype, "signatures", void 0);
__decorate([
    Struct.field('string')
], ActionObject.prototype, "@timestamp", void 0);
__decorate([
    Struct.field('string')
], ActionObject.prototype, "timestamp", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "block_num", void 0);
__decorate([
    Struct.field('string')
], ActionObject.prototype, "block_id", void 0);
__decorate([
    Struct.field('string')
], ActionObject.prototype, "trx_id", void 0);
__decorate([
    Struct.field(Receipt, { array: true })
], ActionObject.prototype, "receipts", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "cpu_usage_us", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "global_sequence", void 0);
__decorate([
    Struct.field('string')
], ActionObject.prototype, "producer", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "net_usage_words", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "code_sequence", void 0);
__decorate([
    Struct.field('number')
], ActionObject.prototype, "abi_sequence", void 0);
__decorate([
    Struct.field('string')
], ActionObject.prototype, "act_digest", void 0);
ActionObject = __decorate([
    Struct.type('get_actions_response_action')
], ActionObject);
let GetActionsTotal = class GetActionsTotal extends Struct {
};
__decorate([
    Struct.field('number')
], GetActionsTotal.prototype, "value", void 0);
__decorate([
    Struct.field('string')
], GetActionsTotal.prototype, "relation", void 0);
GetActionsTotal = __decorate([
    Struct.type('get_actions_total')
], GetActionsTotal);
let GetActionsResponse = class GetActionsResponse extends Struct {
};
__decorate([
    Struct.field('number')
], GetActionsResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('boolean')
], GetActionsResponse.prototype, "cached", void 0);
__decorate([
    Struct.field('number')
], GetActionsResponse.prototype, "lib", void 0);
__decorate([
    Struct.field('number')
], GetActionsResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], GetActionsResponse.prototype, "last_indexed_block_time", void 0);
__decorate([
    Struct.field(GetActionsTotal)
], GetActionsResponse.prototype, "total", void 0);
__decorate([
    Struct.field(ActionObject, { array: true })
], GetActionsResponse.prototype, "actions", void 0);
GetActionsResponse = __decorate([
    Struct.type('get_actions_response')
], GetActionsResponse);
let HealthService = class HealthService extends Struct {
};
__decorate([
    Struct.field('string')
], HealthService.prototype, "service", void 0);
__decorate([
    Struct.field('string')
], HealthService.prototype, "status", void 0);
__decorate([
    Struct.field('number')
], HealthService.prototype, "time", void 0);
__decorate([
    Struct.field('any', { optional: true })
], HealthService.prototype, "service_data", void 0);
HealthService = __decorate([
    Struct.type('health_service')
], HealthService);
let HealthFeaturesStreaming = class HealthFeaturesStreaming extends Struct {
};
__decorate([
    Struct.field('boolean')
], HealthFeaturesStreaming.prototype, "enable", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeaturesStreaming.prototype, "traces", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeaturesStreaming.prototype, "deltas", void 0);
HealthFeaturesStreaming = __decorate([
    Struct.type('health_features_streaming')
], HealthFeaturesStreaming);
let HealthFeaturesTables = class HealthFeaturesTables extends Struct {
};
__decorate([
    Struct.field('boolean')
], HealthFeaturesTables.prototype, "proposals", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeaturesTables.prototype, "accounts", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeaturesTables.prototype, "voters", void 0);
HealthFeaturesTables = __decorate([
    Struct.type('health_features_tables')
], HealthFeaturesTables);
let HealthFeatures = class HealthFeatures extends Struct {
};
__decorate([
    Struct.field(HealthFeaturesStreaming)
], HealthFeatures.prototype, "streaming", void 0);
__decorate([
    Struct.field(HealthFeaturesTables)
], HealthFeatures.prototype, "tables", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "index_deltas", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "index_transfer_memo", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "index_all_deltas", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "deferred_trx", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "failed_trx", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "resource_limits", void 0);
__decorate([
    Struct.field('boolean')
], HealthFeatures.prototype, "resource_usage", void 0);
HealthFeatures = __decorate([
    Struct.type('health_features')
], HealthFeatures);
let HealthResponse = class HealthResponse extends Struct {
};
__decorate([
    Struct.field('string')
], HealthResponse.prototype, "version", void 0);
__decorate([
    Struct.field('string')
], HealthResponse.prototype, "version_hash", void 0);
__decorate([
    Struct.field('string')
], HealthResponse.prototype, "host", void 0);
__decorate([
    Struct.field(HealthService, { array: true })
], HealthResponse.prototype, "health", void 0);
__decorate([
    Struct.field(HealthFeatures)
], HealthResponse.prototype, "features", void 0);
__decorate([
    Struct.field('number')
], HealthResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('number')
], HealthResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], HealthResponse.prototype, "last_indexed_block_time", void 0);
HealthResponse = __decorate([
    Struct.type('health_response')
], HealthResponse);
let ApiUsageTotal = class ApiUsageTotal extends Struct {
};
__decorate([
    Struct.field('any')
], ApiUsageTotal.prototype, "responses", void 0);
ApiUsageTotal = __decorate([
    Struct.type('api_usage_total')
], ApiUsageTotal);
let ApiUsageBucket = class ApiUsageBucket extends Struct {
};
__decorate([
    Struct.field('string')
], ApiUsageBucket.prototype, "timestamp", void 0);
__decorate([
    Struct.field('any')
], ApiUsageBucket.prototype, "responses", void 0);
ApiUsageBucket = __decorate([
    Struct.type('api_usage_bucket')
], ApiUsageBucket);
let ApiUsageResponse = class ApiUsageResponse extends Struct {
};
__decorate([
    Struct.field(ApiUsageTotal)
], ApiUsageResponse.prototype, "total", void 0);
__decorate([
    Struct.field(ApiUsageBucket, { array: true })
], ApiUsageResponse.prototype, "buckets", void 0);
__decorate([
    Struct.field('number')
], ApiUsageResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('number')
], ApiUsageResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], ApiUsageResponse.prototype, "last_indexed_block_time", void 0);
ApiUsageResponse = __decorate([
    Struct.type('api_usage_response')
], ApiUsageResponse);
let MissedBlocksStats = class MissedBlocksStats extends Struct {
};
__decorate([
    Struct.field('any')
], MissedBlocksStats.prototype, "by_producer", void 0);
MissedBlocksStats = __decorate([
    Struct.type('missed_blocks_stats')
], MissedBlocksStats);
let MissedBlocksResponse = class MissedBlocksResponse extends Struct {
};
__decorate([
    Struct.field(MissedBlocksStats)
], MissedBlocksResponse.prototype, "stats", void 0);
__decorate([
    Struct.field('any', { array: true })
], MissedBlocksResponse.prototype, "events", void 0);
__decorate([
    Struct.field('number')
], MissedBlocksResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('number')
], MissedBlocksResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], MissedBlocksResponse.prototype, "last_indexed_block_time", void 0);
MissedBlocksResponse = __decorate([
    Struct.type('missed_blocks_response')
], MissedBlocksResponse);
let ResourceUsageStats = class ResourceUsageStats extends Struct {
};
__decorate([
    Struct.field('number')
], ResourceUsageStats.prototype, "count", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "min", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "max", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "avg", void 0);
__decorate([
    Struct.field('number')
], ResourceUsageStats.prototype, "sum", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "sum_of_squares", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "variance", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "variance_population", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "variance_sampling", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_population", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_sampling", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_bounds_upper", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_bounds_lower", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_bounds_upper_population", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_bounds_lower_population", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_bounds_upper_sampling", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsageStats.prototype, "std_deviation_bounds_lower_sampling", void 0);
ResourceUsageStats = __decorate([
    Struct.type('resource_usage_stats')
], ResourceUsageStats);
let ResourceUsagePercentiles = class ResourceUsagePercentiles extends Struct {
};
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "1.0", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "5.0", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "25.0", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "50.0", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "75.0", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "95.0", void 0);
__decorate([
    Struct.field('number', { optional: true })
], ResourceUsagePercentiles.prototype, "99.0", void 0);
ResourceUsagePercentiles = __decorate([
    Struct.type('resource_usage_percentiles')
], ResourceUsagePercentiles);
let ResourceUsage = class ResourceUsage extends Struct {
};
__decorate([
    Struct.field(ResourceUsageStats)
], ResourceUsage.prototype, "stats", void 0);
__decorate([
    Struct.field(ResourceUsagePercentiles)
], ResourceUsage.prototype, "percentiles", void 0);
ResourceUsage = __decorate([
    Struct.type('resource_usage')
], ResourceUsage);
let GetResourceUsageResponse = class GetResourceUsageResponse extends Struct {
};
__decorate([
    Struct.field(ResourceUsage)
], GetResourceUsageResponse.prototype, "cpu", void 0);
__decorate([
    Struct.field(ResourceUsage)
], GetResourceUsageResponse.prototype, "net", void 0);
__decorate([
    Struct.field('boolean')
], GetResourceUsageResponse.prototype, "cached", void 0);
__decorate([
    Struct.field('number')
], GetResourceUsageResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('number')
], GetResourceUsageResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], GetResourceUsageResponse.prototype, "last_indexed_block_time", void 0);
GetResourceUsageResponse = __decorate([
    Struct.type('get_resource_usage_response')
], GetResourceUsageResponse);
let Permission = class Permission extends Struct {
};
__decorate([
    Struct.field('string')
], Permission.prototype, "perm_name", void 0);
__decorate([
    Struct.field('string')
], Permission.prototype, "parent", void 0);
__decorate([
    Struct.field('any')
], Permission.prototype, "required_auth", void 0);
Permission = __decorate([
    Struct.type('permission')
], Permission);
let Limit = class Limit extends Struct {
};
__decorate([
    Struct.field('number')
], Limit.prototype, "used", void 0);
__decorate([
    Struct.field('number')
], Limit.prototype, "available", void 0);
__decorate([
    Struct.field('number')
], Limit.prototype, "max", void 0);
Limit = __decorate([
    Struct.type('limit')
], Limit);
let TotalResources = class TotalResources extends Struct {
};
__decorate([
    Struct.field('string')
], TotalResources.prototype, "owner", void 0);
__decorate([
    Struct.field('string')
], TotalResources.prototype, "net_weight", void 0);
__decorate([
    Struct.field('string')
], TotalResources.prototype, "cpu_weight", void 0);
__decorate([
    Struct.field('number')
], TotalResources.prototype, "ram_bytes", void 0);
TotalResources = __decorate([
    Struct.type('total_resources')
], TotalResources);
let SelfDelegatedBandwidth = class SelfDelegatedBandwidth extends Struct {
};
__decorate([
    Struct.field('string')
], SelfDelegatedBandwidth.prototype, "from", void 0);
__decorate([
    Struct.field('string')
], SelfDelegatedBandwidth.prototype, "to", void 0);
__decorate([
    Struct.field('string')
], SelfDelegatedBandwidth.prototype, "net_weight", void 0);
__decorate([
    Struct.field('string')
], SelfDelegatedBandwidth.prototype, "cpu_weight", void 0);
SelfDelegatedBandwidth = __decorate([
    Struct.type('self_delegated_bandwidth')
], SelfDelegatedBandwidth);
let VoterInfo = class VoterInfo extends Struct {
};
__decorate([
    Struct.field('string')
], VoterInfo.prototype, "owner", void 0);
__decorate([
    Struct.field('string')
], VoterInfo.prototype, "proxy", void 0);
__decorate([
    Struct.field('string[]')
], VoterInfo.prototype, "producers", void 0);
__decorate([
    Struct.field('number')
], VoterInfo.prototype, "staked", void 0);
__decorate([
    Struct.field('string')
], VoterInfo.prototype, "last_vote_weight", void 0);
__decorate([
    Struct.field('string')
], VoterInfo.prototype, "proxied_vote_weight", void 0);
__decorate([
    Struct.field('number')
], VoterInfo.prototype, "is_proxy", void 0);
__decorate([
    Struct.field('number')
], VoterInfo.prototype, "flags1", void 0);
__decorate([
    Struct.field('number')
], VoterInfo.prototype, "reserved2", void 0);
__decorate([
    Struct.field('string')
], VoterInfo.prototype, "reserved3", void 0);
VoterInfo = __decorate([
    Struct.type('voter_info')
], VoterInfo);
let Account = class Account extends Struct {
};
__decorate([
    Struct.field('string')
], Account.prototype, "account_name", void 0);
__decorate([
    Struct.field('number')
], Account.prototype, "head_block_num", void 0);
__decorate([
    Struct.field('string')
], Account.prototype, "head_block_time", void 0);
__decorate([
    Struct.field('boolean')
], Account.prototype, "privileged", void 0);
__decorate([
    Struct.field('string')
], Account.prototype, "last_code_update", void 0);
__decorate([
    Struct.field('string')
], Account.prototype, "created", void 0);
__decorate([
    Struct.field('string')
], Account.prototype, "core_liquid_balance", void 0);
__decorate([
    Struct.field('number')
], Account.prototype, "ram_quota", void 0);
__decorate([
    Struct.field('number')
], Account.prototype, "net_weight", void 0);
__decorate([
    Struct.field('number')
], Account.prototype, "cpu_weight", void 0);
__decorate([
    Struct.field(Limit)
], Account.prototype, "net_limit", void 0);
__decorate([
    Struct.field(Limit)
], Account.prototype, "cpu_limit", void 0);
__decorate([
    Struct.field('number')
], Account.prototype, "ram_usage", void 0);
__decorate([
    Struct.field(Permission, { array: true })
], Account.prototype, "permissions", void 0);
__decorate([
    Struct.field(TotalResources)
], Account.prototype, "total_resources", void 0);
__decorate([
    Struct.field(SelfDelegatedBandwidth)
], Account.prototype, "self_delegated_bandwidth", void 0);
__decorate([
    Struct.field('any', { optional: true })
], Account.prototype, "refund_request", void 0);
__decorate([
    Struct.field(VoterInfo)
], Account.prototype, "voter_info", void 0);
__decorate([
    Struct.field('any', { optional: true })
], Account.prototype, "rex_info", void 0);
__decorate([
    Struct.field(Limit)
], Account.prototype, "subjective_cpu_bill_limit", void 0);
Account = __decorate([
    Struct.type('account')
], Account);
let Link = class Link extends Struct {
};
__decorate([
    Struct.field('string')
], Link.prototype, "timestamp", void 0);
__decorate([
    Struct.field('string')
], Link.prototype, "permission", void 0);
__decorate([
    Struct.field('string')
], Link.prototype, "code", void 0);
__decorate([
    Struct.field('string')
], Link.prototype, "action", void 0);
Link = __decorate([
    Struct.type('link')
], Link);
let Token = class Token extends Struct {
};
__decorate([
    Struct.field('string')
], Token.prototype, "symbol", void 0);
__decorate([
    Struct.field('number')
], Token.prototype, "precision", void 0);
__decorate([
    Struct.field('number')
], Token.prototype, "amount", void 0);
__decorate([
    Struct.field('string')
], Token.prototype, "contract", void 0);
Token = __decorate([
    Struct.type('token')
], Token);
let Action = class Action extends Struct {
};
__decorate([
    Struct.field('string')
], Action.prototype, "@timestamp", void 0);
__decorate([
    Struct.field('string')
], Action.prototype, "timestamp", void 0);
__decorate([
    Struct.field('number')
], Action.prototype, "block_num", void 0);
__decorate([
    Struct.field('string')
], Action.prototype, "block_id", void 0);
__decorate([
    Struct.field('string')
], Action.prototype, "trx_id", void 0);
__decorate([
    Struct.field('any')
], Action.prototype, "act", void 0);
__decorate([
    Struct.field(Receipt, { array: true })
], Action.prototype, "receipts", void 0);
__decorate([
    Struct.field('number')
], Action.prototype, "cpu_usage_us", void 0);
__decorate([
    Struct.field('number')
], Action.prototype, "net_usage_words", void 0);
__decorate([
    Struct.field('number')
], Action.prototype, "global_sequence", void 0);
__decorate([
    Struct.field('string')
], Action.prototype, "producer", void 0);
__decorate([
    Struct.field('number')
], Action.prototype, "action_ordinal", void 0);
__decorate([
    Struct.field('number')
], Action.prototype, "creator_action_ordinal", void 0);
__decorate([
    Struct.field(Signature, { array: true })
], Action.prototype, "signatures", void 0);
Action = __decorate([
    Struct.type('action')
], Action);
let GetAccountResponse = class GetAccountResponse extends Struct {
};
__decorate([
    Struct.field('number')
], GetAccountResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('number')
], GetAccountResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], GetAccountResponse.prototype, "last_indexed_block_time", void 0);
__decorate([
    Struct.field(Account)
], GetAccountResponse.prototype, "account", void 0);
__decorate([
    Struct.field(Link, { array: true })
], GetAccountResponse.prototype, "links", void 0);
__decorate([
    Struct.field(Token, { array: true })
], GetAccountResponse.prototype, "tokens", void 0);
__decorate([
    Struct.field('number')
], GetAccountResponse.prototype, "total_actions", void 0);
__decorate([
    Struct.field(Action, { array: true })
], GetAccountResponse.prototype, "actions", void 0);
GetAccountResponse = __decorate([
    Struct.type('get_account_response')
], GetAccountResponse);
let GetCreatedAccountsResponse = class GetCreatedAccountsResponse extends Struct {
};
__decorate([
    Struct.field('CreatedAccount[]')
], GetCreatedAccountsResponse.prototype, "accounts", void 0);
__decorate([
    Struct.field('number')
], GetCreatedAccountsResponse.prototype, "query_time_ms", void 0);
__decorate([
    Struct.field('number')
], GetCreatedAccountsResponse.prototype, "last_indexed_block", void 0);
__decorate([
    Struct.field('string')
], GetCreatedAccountsResponse.prototype, "last_indexed_block_time", void 0);
GetCreatedAccountsResponse = __decorate([
    Struct.type('get_account_response')
], GetCreatedAccountsResponse);

var types$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get Account () { return Account; },
    get AccountRamDelta () { return AccountRamDelta; },
    get Action () { return Action; },
    get ActionDataHeader () { return ActionDataHeader; },
    get ActionObject () { return ActionObject; },
    get ApiUsageBucket () { return ApiUsageBucket; },
    get ApiUsageResponse () { return ApiUsageResponse; },
    get ApiUsageTotal () { return ApiUsageTotal; },
    get AuthSequence () { return AuthSequence; },
    get GetAccountResponse () { return GetAccountResponse; },
    get GetActionsResponse () { return GetActionsResponse; },
    get GetActionsTotal () { return GetActionsTotal; },
    get GetCreatedAccountsResponse () { return GetCreatedAccountsResponse; },
    get GetResourceUsageResponse () { return GetResourceUsageResponse; },
    get GetTransactionResponse () { return GetTransactionResponse; },
    get GetTransactionResponseAction () { return GetTransactionResponseAction; },
    get HealthFeatures () { return HealthFeatures; },
    get HealthFeaturesStreaming () { return HealthFeaturesStreaming; },
    get HealthFeaturesTables () { return HealthFeaturesTables; },
    get HealthResponse () { return HealthResponse; },
    get HealthService () { return HealthService; },
    get Limit () { return Limit; },
    get Link () { return Link; },
    get MissedBlocksResponse () { return MissedBlocksResponse; },
    get MissedBlocksStats () { return MissedBlocksStats; },
    get Permission () { return Permission; },
    get Receipt () { return Receipt; },
    get ResourceUsage () { return ResourceUsage; },
    get ResourceUsagePercentiles () { return ResourceUsagePercentiles; },
    get ResourceUsageStats () { return ResourceUsageStats; },
    get SelfDelegatedBandwidth () { return SelfDelegatedBandwidth; },
    get Token () { return Token; },
    get TotalResources () { return TotalResources; },
    get VoterInfo () { return VoterInfo; }
});

var types$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    v1: types$3,
    v2: types$2
});

var BlockHeader_1;
let HandshakeMessage = class HandshakeMessage extends Struct {
};
__decorate([
    Struct.field('uint16')
], HandshakeMessage.prototype, "networkVersion", void 0);
__decorate([
    Struct.field('checksum256')
], HandshakeMessage.prototype, "chainId", void 0);
__decorate([
    Struct.field('checksum256')
], HandshakeMessage.prototype, "nodeId", void 0);
__decorate([
    Struct.field('public_key')
], HandshakeMessage.prototype, "key", void 0);
__decorate([
    Struct.field('int64')
], HandshakeMessage.prototype, "time", void 0);
__decorate([
    Struct.field('checksum256')
], HandshakeMessage.prototype, "token", void 0);
__decorate([
    Struct.field('signature')
], HandshakeMessage.prototype, "sig", void 0);
__decorate([
    Struct.field('string')
], HandshakeMessage.prototype, "p2pAddress", void 0);
__decorate([
    Struct.field('uint32')
], HandshakeMessage.prototype, "lastIrreversibleBlockNumber", void 0);
__decorate([
    Struct.field(BlockId)
], HandshakeMessage.prototype, "lastIrreversibleBlockId", void 0);
__decorate([
    Struct.field('uint32')
], HandshakeMessage.prototype, "headNum", void 0);
__decorate([
    Struct.field(BlockId)
], HandshakeMessage.prototype, "headId", void 0);
__decorate([
    Struct.field('string')
], HandshakeMessage.prototype, "os", void 0);
__decorate([
    Struct.field('string')
], HandshakeMessage.prototype, "agent", void 0);
__decorate([
    Struct.field('int16')
], HandshakeMessage.prototype, "generation", void 0);
HandshakeMessage = __decorate([
    Struct.type('handshake_message')
], HandshakeMessage);
let ChainSizeMessage = class ChainSizeMessage extends Struct {
};
__decorate([
    Struct.field('uint32')
], ChainSizeMessage.prototype, "lastIrreversibleBlockNumber", void 0);
__decorate([
    Struct.field(BlockId)
], ChainSizeMessage.prototype, "lastIrreversibleBlockId", void 0);
__decorate([
    Struct.field('uint32')
], ChainSizeMessage.prototype, "headNum", void 0);
__decorate([
    Struct.field(BlockId)
], ChainSizeMessage.prototype, "headId", void 0);
ChainSizeMessage = __decorate([
    Struct.type('chain_size_message')
], ChainSizeMessage);
let GoAwayMessage = class GoAwayMessage extends Struct {
};
__decorate([
    Struct.field('uint8')
], GoAwayMessage.prototype, "reason", void 0);
__decorate([
    Struct.field('checksum256')
], GoAwayMessage.prototype, "nodeId", void 0);
GoAwayMessage = __decorate([
    Struct.type('go_away_message')
], GoAwayMessage);
let TimeMessage = class TimeMessage extends Struct {
};
__decorate([
    Struct.field('int64')
], TimeMessage.prototype, "org", void 0);
__decorate([
    Struct.field('int64')
], TimeMessage.prototype, "rec", void 0);
__decorate([
    Struct.field('int64')
], TimeMessage.prototype, "xmt", void 0);
__decorate([
    Struct.field('int64')
], TimeMessage.prototype, "dst", void 0);
TimeMessage = __decorate([
    Struct.type('time_message')
], TimeMessage);
let NoticeMessage = class NoticeMessage extends Struct {
};
__decorate([
    Struct.field('checksum256', { array: true })
], NoticeMessage.prototype, "knownTrx", void 0);
__decorate([
    Struct.field(BlockId, { array: true })
], NoticeMessage.prototype, "knownBlocks", void 0);
NoticeMessage = __decorate([
    Struct.type('notice_message')
], NoticeMessage);
let RequestMessage = class RequestMessage extends Struct {
};
__decorate([
    Struct.field('checksum256', { array: true })
], RequestMessage.prototype, "reqTrx", void 0);
__decorate([
    Struct.field(BlockId, { array: true })
], RequestMessage.prototype, "reqBlocks", void 0);
RequestMessage = __decorate([
    Struct.type('request_message')
], RequestMessage);
let SyncRequestMessage = class SyncRequestMessage extends Struct {
};
__decorate([
    Struct.field('uint32')
], SyncRequestMessage.prototype, "startBlock", void 0);
__decorate([
    Struct.field('uint32')
], SyncRequestMessage.prototype, "endBlock", void 0);
SyncRequestMessage = __decorate([
    Struct.type('sync_request_message')
], SyncRequestMessage);
let NewProducersEntry = class NewProducersEntry extends Struct {
};
__decorate([
    Struct.field('name')
], NewProducersEntry.prototype, "producer_name", void 0);
__decorate([
    Struct.field('public_key')
], NewProducersEntry.prototype, "block_signing_key", void 0);
NewProducersEntry = __decorate([
    Struct.type('new_producers_entry')
], NewProducersEntry);
let NewProducers = class NewProducers extends Struct {
};
__decorate([
    Struct.field('uint32')
], NewProducers.prototype, "version", void 0);
__decorate([
    Struct.field(NewProducersEntry, { array: true })
], NewProducers.prototype, "producers", void 0);
NewProducers = __decorate([
    Struct.type('new_producers')
], NewProducers);
let BlockExtension = class BlockExtension extends Struct {
};
__decorate([
    Struct.field('uint16')
], BlockExtension.prototype, "type", void 0);
__decorate([
    Struct.field('bytes')
], BlockExtension.prototype, "data", void 0);
BlockExtension = __decorate([
    Struct.type('block_extension')
], BlockExtension);
let HeaderExtension = class HeaderExtension extends Struct {
};
__decorate([
    Struct.field('uint16')
], HeaderExtension.prototype, "type", void 0);
__decorate([
    Struct.field('bytes')
], HeaderExtension.prototype, "data", void 0);
HeaderExtension = __decorate([
    Struct.type('header_extension')
], HeaderExtension);
let TrxVariant = class TrxVariant extends Variant {
};
TrxVariant = __decorate([
    Variant.type('trx_variant', [Checksum256, PackedTransaction])
], TrxVariant);
let FullTransactionReceipt = class FullTransactionReceipt extends Struct {
};
__decorate([
    Struct.field(UInt8)
], FullTransactionReceipt.prototype, "status", void 0);
__decorate([
    Struct.field(UInt32)
], FullTransactionReceipt.prototype, "cpu_usage_us", void 0);
__decorate([
    Struct.field(VarUInt)
], FullTransactionReceipt.prototype, "net_usage_words", void 0);
__decorate([
    Struct.field(TrxVariant)
], FullTransactionReceipt.prototype, "trx", void 0);
FullTransactionReceipt = __decorate([
    Struct.type('full_transaction_receipt')
], FullTransactionReceipt);
let BlockHeader = BlockHeader_1 = class BlockHeader extends Struct {
    get blockNum() {
        return this.previous.blockNum.adding(1);
    }
    get id() {
        const id = Checksum256.hash(Serializer.encode({ object: this, type: BlockHeader_1 }));
        return BlockId.fromBlockChecksum(id, this.blockNum);
    }
};
__decorate([
    Struct.field('uint32')
], BlockHeader.prototype, "timeSlot", void 0);
__decorate([
    Struct.field('name')
], BlockHeader.prototype, "producer", void 0);
__decorate([
    Struct.field('uint16')
], BlockHeader.prototype, "confirmed", void 0);
__decorate([
    Struct.field(BlockId)
], BlockHeader.prototype, "previous", void 0);
__decorate([
    Struct.field(BlockId)
], BlockHeader.prototype, "transaction_mroot", void 0);
__decorate([
    Struct.field(BlockId)
], BlockHeader.prototype, "action_mroot", void 0);
__decorate([
    Struct.field('uint32')
], BlockHeader.prototype, "schedule_version", void 0);
__decorate([
    Struct.field(NewProducers, { optional: true })
], BlockHeader.prototype, "new_producers", void 0);
__decorate([
    Struct.field(HeaderExtension, { array: true })
], BlockHeader.prototype, "header_extensions", void 0);
BlockHeader = BlockHeader_1 = __decorate([
    Struct.type('block_header')
], BlockHeader);
let SignedBlock = class SignedBlock extends BlockHeader {
};
__decorate([
    Struct.field('signature')
], SignedBlock.prototype, "producer_signature", void 0);
__decorate([
    Struct.field(FullTransactionReceipt, { array: true })
], SignedBlock.prototype, "transactions", void 0);
__decorate([
    Struct.field(BlockExtension, { array: true })
], SignedBlock.prototype, "block_extensions", void 0);
SignedBlock = __decorate([
    Struct.type('signed_block')
], SignedBlock);
let NetMessage = class NetMessage extends Variant {
};
NetMessage = __decorate([
    Variant.type('net_message', [
        HandshakeMessage,
        ChainSizeMessage,
        GoAwayMessage,
        TimeMessage,
        NoticeMessage,
        RequestMessage,
        SyncRequestMessage,
        SignedBlock,
        PackedTransaction,
    ])
], NetMessage);

var types = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get BlockExtension () { return BlockExtension; },
    get BlockHeader () { return BlockHeader; },
    get ChainSizeMessage () { return ChainSizeMessage; },
    get FullTransactionReceipt () { return FullTransactionReceipt; },
    get GoAwayMessage () { return GoAwayMessage; },
    get HandshakeMessage () { return HandshakeMessage; },
    get HeaderExtension () { return HeaderExtension; },
    get NetMessage () { return NetMessage; },
    get NewProducers () { return NewProducers; },
    get NewProducersEntry () { return NewProducersEntry; },
    get NoticeMessage () { return NoticeMessage; },
    get RequestMessage () { return RequestMessage; },
    get SignedBlock () { return SignedBlock; },
    get SyncRequestMessage () { return SyncRequestMessage; },
    get TimeMessage () { return TimeMessage; }
});

class P2PClient {
    constructor(options) {
        if (options.provider) {
            this.provider = options.provider;
        }
        else {
            throw new Error('Missing provider');
        }
        if (options.setTimeoutImpl !== undefined) {
            this.setTimeoutImpl = options.setTimeoutImpl;
        }
        else {
            this.setTimeoutImpl = setTimeout;
        }
        if (options.heartbeatTimoutMs !== undefined) {
            this.heartbeatTimoutMs = options.heartbeatTimoutMs;
            this.resetHeartbeat();
        }
        this.provider.on('data', (data) => {
            this.handleData(data);
        });
        this.provider.on('error', (e) => {
            this.emit('error', [e]);
        });
        this.provider.on('close', () => {
            this.emit('close', []);
        });
        this.eventListeners = {};
    }
    send(message, done) {
        const wrappedMessage = NetMessage.from(message);
        const messageBuffer = Serializer.encode({ object: wrappedMessage });
        this.provider.write(messageBuffer.array, done);
    }
    end(cb) {
        this.endHeartbeat();
        this.provider.end(cb);
    }
    destroy(err) {
        this.endHeartbeat();
        this.provider.destroy(err);
    }
    handleData(data) {
        try {
            const message = Serializer.decode({ type: NetMessage, data });
            this.emit('message', [message]);
        }
        catch (e) {
            this.emit('error', [e]);
        }
    }
    endHeartbeat() {
        if (this.heartbeatTimoutId !== undefined) {
            clearTimeout(this.heartbeatTimoutId);
            this.heartbeatTimoutId = undefined;
        }
    }
    resetHeartbeat() {
        this.endHeartbeat();
        if (this.heartbeatTimoutMs !== undefined) {
            this.setTimeoutImpl(() => {
                this.handleHeartbeat();
            }, this.heartbeatTimoutMs);
        }
    }
    handleHeartbeat() {
        const now = Date.now();
        const timeMessage = TimeMessage.from({
            org: now,
            rec: 0,
            xmt: 0,
            dst: 0,
        });
        this.send(timeMessage, () => {
            this.resetHeartbeat();
        });
    }
    on(event, handler) {
        return this.addListenerInternal(event, handler, false, false);
    }
    once(event, handler) {
        return this.addListenerInternal(event, handler, true, false);
    }
    addListener(event, handler) {
        return this.addListenerInternal(event, handler, false, false);
    }
    prependListener(event, handler) {
        return this.addListenerInternal(event, handler, false, true);
    }
    removeListener(event, handler) {
        if (this.eventListeners[event] !== undefined) {
            this.eventListeners[event] = this.eventListeners[event].filter((e) => {
                return e.handler !== handler;
            });
        }
        return this;
    }
    addListenerInternal(event, handler, once, prepend) {
        if (this.eventListeners[event] === undefined) {
            this.eventListeners[event] = [];
        }
        if (!prepend) {
            this.eventListeners[event].push({ once, handler });
        }
        else {
            this.eventListeners[event].unshift({ once, handler });
        }
        return this;
    }
    emit(event, args) {
        if (this.eventListeners[event] === undefined) {
            return;
        }
        for (const { handler } of this.eventListeners[event]) {
            // typescript is loosing the specificity provided by T in the assignment above
            const erasedHandler = handler;
            erasedHandler(...args);
        }
        this.eventListeners[event] = this.eventListeners[event].filter((e) => {
            return e.once !== true;
        });
    }
}
P2PClient.__className = 'P2PClient';

class SimpleEnvelopeP2PProvider {
    constructor(nextProvider) {
        this.nextProvider = nextProvider;
        this.remainingData = new Uint8Array(0);
        this.dataHandlers = [];
        this.errorHandlers = [];
        // process nextProvider data
        this.nextProvider.on('data', (data) => {
            const newData = new Uint8Array(this.remainingData.byteLength + data.byteLength);
            newData.set(this.remainingData, 0);
            newData.set(data, this.remainingData.byteLength);
            this.remainingData = newData;
            while (this.remainingData.byteLength >= 4) {
                const view = new DataView(this.remainingData.buffer);
                const messageLength = view.getUint32(0, true);
                if (messageLength > SimpleEnvelopeP2PProvider.maxReadLength) {
                    this.emitError(new Error('Incoming Message too long'));
                }
                if (this.remainingData.byteLength < 4 + messageLength) {
                    // need more data
                    break;
                }
                const messageBuffer = this.remainingData.subarray(4, 4 + messageLength);
                this.remainingData = this.remainingData.slice(4 + messageLength);
                this.emitData(messageBuffer);
            }
        });
        // proxy error
        this.nextProvider.on('error', (err) => {
            this.emitError(err);
        });
    }
    write(data, done) {
        const nextBuffer = new Uint8Array(4 + data.byteLength);
        const view = new DataView(nextBuffer.buffer);
        view.setUint32(0, data.byteLength, true);
        nextBuffer.set(data, 4);
        this.nextProvider.write(nextBuffer, done);
    }
    end(cb) {
        this.nextProvider.end(cb);
    }
    destroy(err) {
        this.nextProvider.destroy(err);
    }
    on(event, handler) {
        if (event === 'data') {
            this.dataHandlers.push(handler);
        }
        else if (event === 'error') {
            this.errorHandlers.push(handler);
        }
        else {
            this.nextProvider.on(event, handler);
        }
        return this;
    }
    emitData(messageBuffer) {
        for (const handler of this.dataHandlers) {
            // typescript is loosing the specificity provided by T in the assignment above
            handler(messageBuffer);
        }
    }
    emitError(err) {
        for (const handler of this.errorHandlers) {
            // typescript is loosing the specificity provided by T in the assignment above
            handler(err);
        }
    }
}
SimpleEnvelopeP2PProvider.maxReadLength = 8 * 1024 * 1024;

/**
 * Cancelable promises
 *
 * https://stackoverflow.com/questions/46461801/possible-to-add-a-cancel-method-to-promise-in-typescript/46464377#46464377
 */
class Canceled extends Error {
    constructor(reason, silent = false) {
        super(reason);
        this.silent = false;
        this.silent = silent;
        Object.setPrototypeOf(this, Canceled.prototype);
    }
}
function cancelable(promise, onCancel) {
    let cancel = null;
    const cancelable = new Promise((resolve, reject) => {
        cancel = (reason = '', silent = false) => {
            try {
                if (onCancel) {
                    onCancel(new Canceled(reason, silent));
                }
            }
            catch (e) {
                reject(e);
            }
            return cancelable;
        };
        promise.then(resolve, reject);
    });
    if (cancel) {
        cancelable.cancel = cancel;
    }
    return cancelable;
}

let ExplorerDefinition = class ExplorerDefinition extends Struct {
    url(id) {
        return `${this.prefix}${id}${this.suffix}`;
    }
};
__decorate([
    Struct.field('string')
], ExplorerDefinition.prototype, "prefix", void 0);
__decorate([
    Struct.field('string')
], ExplorerDefinition.prototype, "suffix", void 0);
ExplorerDefinition = __decorate([
    Struct.type('explorer_definition')
], ExplorerDefinition);

var Logo_1;
let Logo = Logo_1 = class Logo extends Struct {
    static from(data) {
        if (typeof data === 'string') {
            return new Logo_1({ light: data, dark: data });
        }
        return super.from(data);
    }
    getVariant(variant) {
        return this[variant];
    }
    toString() {
        return this.light;
    }
};
__decorate([
    Struct.field('string')
], Logo.prototype, "dark", void 0);
__decorate([
    Struct.field('string')
], Logo.prototype, "light", void 0);
Logo = Logo_1 = __decorate([
    Struct.type('logo')
], Logo);

/**
 * The information required to interact with a given chain.
 */
class ChainDefinition {
    constructor(data) {
        this.id = Checksum256.from(data.id);
        this.url = data.url;
        this.logo = data.logo;
        this.explorer = data.explorer;
        this.accountDataType = data.accountDataType;
    }
    static from(data) {
        return new ChainDefinition({
            ...data,
            explorer: data.explorer ? ExplorerDefinition.from(data.explorer) : undefined,
            logo: data.logo ? Logo.from(data.logo) : undefined,
        });
    }
    get name() {
        const indice = chainIdsToIndices.get(String(this.id));
        if (!indice) {
            return 'Unknown blockchain';
        }
        return ChainNames[indice];
    }
    getLogo() {
        const id = String(this.id);
        if (this.logo) {
            return Logo.from(this.logo);
        }
        if (chainLogos.has(id)) {
            const logo = chainLogos.get(id);
            if (logo) {
                return Logo.from(logo);
            }
        }
        return undefined;
    }
    equals(def) {
        const other = ChainDefinition.from(def);
        return this.id.equals(other.id) && this.url === other.url;
    }
}
/**
 * List of human readable chain names based on the ChainIndices type.
 */
const ChainNames = {
    EOS: 'EOS',
    FIO: 'FIO',
    FIOTestnet: 'FIO (Testnet)',
    Jungle4: 'Jungle 4 (Testnet)',
    KylinTestnet: 'Kylin (Testnet)',
    Libre: 'Libre',
    LibreTestnet: 'Libre (Testnet)',
    Proton: 'Proton',
    ProtonTestnet: 'Proton (Testnet)',
    Telos: 'Telos',
    TelosTestnet: 'Telos (Testnet)',
    WAX: 'WAX',
    WAXTestnet: 'WAX (Testnet)',
    UX: 'UX Network',
};
let TelosAccountVoterInfo = class TelosAccountVoterInfo extends AccountVoterInfo {
};
__decorate([
    Struct.field(Int64)
], TelosAccountVoterInfo.prototype, "last_stake", void 0);
TelosAccountVoterInfo = __decorate([
    Struct.type('telos_account_voter_info')
], TelosAccountVoterInfo);
let TelosAccountObject = class TelosAccountObject extends AccountObject {
};
__decorate([
    Struct.field(TelosAccountVoterInfo, { optional: true })
], TelosAccountObject.prototype, "voter_info", void 0);
TelosAccountObject = __decorate([
    Struct.type('telos_account_object')
], TelosAccountObject);
let WAXAccountVoterInfo = class WAXAccountVoterInfo extends AccountVoterInfo {
};
__decorate([
    Struct.field(Float64)
], WAXAccountVoterInfo.prototype, "unpaid_voteshare", void 0);
__decorate([
    Struct.field(TimePoint)
], WAXAccountVoterInfo.prototype, "unpaid_voteshare_last_updated", void 0);
__decorate([
    Struct.field(Float64)
], WAXAccountVoterInfo.prototype, "unpaid_voteshare_change_rate", void 0);
__decorate([
    Struct.field(TimePoint)
], WAXAccountVoterInfo.prototype, "last_claim_time", void 0);
WAXAccountVoterInfo = __decorate([
    Struct.type('wax_account_voter_info')
], WAXAccountVoterInfo);
let WAXAccountObject = class WAXAccountObject extends AccountObject {
};
__decorate([
    Struct.field(WAXAccountVoterInfo, { optional: true })
], WAXAccountObject.prototype, "voter_info", void 0);
WAXAccountObject = __decorate([
    Struct.type('wax_account_object')
], WAXAccountObject);
/**
 * An exported list of ChainDefinition entries for select chains.
 */
var Chains;
(function (Chains) {
    Chains.EOS = ChainDefinition.from({
        id: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        url: 'https://eos.greymass.com',
        explorer: {
            prefix: 'https://bloks.io/transaction/',
            suffix: '',
        },
    });
    Chains.FIO = ChainDefinition.from({
        id: '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c',
        url: 'https://fio.greymass.com',
        explorer: {
            prefix: 'https://fio.bloks.io/transaction/',
            suffix: '',
        },
    });
    Chains.FIOTestnet = ChainDefinition.from({
        id: 'b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e',
        url: 'https://fiotestnet.greymass.com',
        explorer: {
            prefix: 'https://fio-test.bloks.io/transaction/',
            suffix: '',
        },
    });
    Chains.Jungle4 = ChainDefinition.from({
        id: '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
        url: 'https://jungle4.greymass.com',
    });
    Chains.KylinTestnet = ChainDefinition.from({
        id: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
        url: 'https://api.kylin.alohaeos.com',
    });
    Chains.Libre = ChainDefinition.from({
        id: '38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465',
        url: 'https://libre.greymass.com',
        explorer: {
            prefix: 'https://www.libreblocks.io/tx/',
            suffix: '',
        },
    });
    Chains.LibreTestnet = ChainDefinition.from({
        id: 'b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee',
        url: 'https://libretestnet.greymass.com',
    });
    Chains.Proton = ChainDefinition.from({
        id: '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0',
        url: 'https://proton.greymass.com',
        explorer: {
            prefix: 'https://www.protonscan.io/transaction/',
            suffix: '',
        },
    });
    Chains.ProtonTestnet = ChainDefinition.from({
        id: '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
        url: 'https://proton-testnet.greymass.com',
    });
    Chains.Telos = ChainDefinition.from({
        id: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        url: 'https://telos.greymass.com',
        explorer: {
            prefix: 'https://explorer.telos.net/transaction/',
            suffix: '',
        },
        accountDataType: TelosAccountObject,
    });
    Chains.TelosTestnet = ChainDefinition.from({
        id: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
        url: 'https://telostestnet.greymass.com',
        accountDataType: TelosAccountObject,
    });
    Chains.WAX = ChainDefinition.from({
        id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        url: 'https://wax.greymass.com',
        explorer: {
            prefix: 'https://waxblock.io/transaction/',
            suffix: '',
        },
        accountDataType: WAXAccountObject,
    });
    Chains.WAXTestnet = ChainDefinition.from({
        id: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
        url: 'https://waxtestnet.greymass.com',
        accountDataType: WAXAccountObject,
    });
    Chains.UX = ChainDefinition.from({
        id: '8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02',
        url: 'https://api.uxnetwork.io',
        explorer: {
            prefix: 'https://explorer.uxnetwork.io/tx/',
            suffix: '',
        },
    });
})(Chains || (Chains = {}));
/**
 * A list of chain IDs and their ChainIndices for reference lookups
 */
const chainIdsToIndices = new Map([
    ['aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', 'EOS'],
    ['21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c', 'FIO'],
    ['b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e', 'FIOTestnet'],
    ['73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d', 'Jungle4'],
    ['5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191', 'KylinTestnet'],
    ['38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465', 'Libre'],
    ['b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee', 'LibreTestnet'],
    ['384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0', 'Proton'],
    ['71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd', 'ProtonTestnet'],
    ['4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11', 'Telos'],
    ['1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f', 'TelosTestnet'],
    ['8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02', 'UX'],
    ['1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4', 'WAX'],
    ['f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12', 'WAXTestnet'],
]);
/**
 * A list of known chain IDs and their logos.
 */
const chainLogos = new Map([
    ['aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', '../assets/logos/eos.png'],
    ['21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c', '../assets/logos/fio.png'],
    ['b20901380af44ef59c5918439a1f9a41d83669020319a80574b804a5f95cbd7e', '../assets/logos/fio.png'],
    [
        '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
        '../assets/logos/jungle.png',
    ],
    [
        '73e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d',
        '../assets/logos/jungle.png',
    ],
    [
        '38b1d7815474d0c60683ecbea321d723e83f5da6ae5f1c1f9fecc69d9ba96465',
        '../assets/logos/libre.png',
    ],
    [
        'b64646740308df2ee06c6b72f34c0f7fa066d940e831f752db2006fcc2b78dee',
        '../assets/logos/libre.png',
    ],
    [
        '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0',
        '../assets/logos/proton.png',
    ],
    [
        '71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd',
        '../assets/logos/proton.png',
    ],
    [
        '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
        '../assets/logos/telos.png',
    ],
    [
        '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
        '../assets/logos/telos.png',
    ],
    ['8fc6dce7942189f842170de953932b1f66693ad3788f766e777b6f9d22335c02', '../assets/logos/ux.png'],
    ['1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4', '../assets/logos/wax.png'],
    ['f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12', '../assets/logos/wax.png'],
]);

class PowerUpStateResource extends Struct {
    constructor() {
        super(...arguments);
        this.default_block_cpu_limit = UInt64.from(200000);
        this.default_block_net_limit = UInt64.from(1048576000);
    }
    // Get the current number of allocated units (shift from REX -> PowerUp)
    get allocated() {
        return 1 - Number(this.weight_ratio) / Number(this.target_weight_ratio) / 100;
    }
    // Get the current percentage of reserved units
    get reserved() {
        return new BN(String(this.utilization)).div(new BN(String(this.weight)));
    }
    // Get the symbol definition for the token
    get symbol() {
        return this.min_price.symbol;
    }
    // Common casting for typed values to numbers
    cast() {
        return {
            adjusted_utilization: Number(this.adjusted_utilization),
            decay_secs: Number(this.decay_secs.value),
            exponent: Number(this.exponent),
            utilization: Number(this.utilization),
            utilization_timestamp: Number(this.utilization_timestamp.value),
            weight: new BN(String(this.weight)),
            weight_ratio: Number(this.weight_ratio),
        };
    }
    // Mimic: https://github.com/EOSIO/eosio.contracts/blob/d7bc0a5cc8c0c2edd4dc61b0126517d0cb46fd94/contracts/eosio.system/src/powerup.cpp#L358
    utilization_increase(sample, frac) {
        const { weight } = this;
        const frac128 = UInt128.from(frac);
        const resultBN = new BN(weight.value.mul(new BN(frac128.value))).div(new BN('1000000000000000'));
        const resultNumber = resultBN.toNumber();
        return Math.ceil(resultNumber);
    }
    // Mimic: https://github.com/EOSIO/eosio.contracts/blob/d7bc0a5cc8c0c2edd4dc61b0126517d0cb46fd94/contracts/eosio.system/src/powerup.cpp#L284-L298
    price_function(utilization) {
        const { exponent, weight } = this.cast();
        const max_price = this.max_price.value;
        const min_price = this.min_price.value;
        let price = min_price;
        const new_exponent = exponent - 1.0;
        if (new_exponent <= 0.0) {
            return max_price;
        }
        else {
            const util_weight = new BN(utilization).div(weight);
            price += (max_price - min_price) * Math.pow(util_weight.toNumber(), new_exponent);
        }
        return price;
    }
    // Mimic: https://github.com/EOSIO/eosio.contracts/blob/d7bc0a5cc8c0c2edd4dc61b0126517d0cb46fd94/contracts/eosio.system/src/powerup.cpp#L274-L280
    price_integral_delta(start_utilization, end_utilization) {
        const { exponent, weight } = this.cast();
        const max_price = this.max_price.value;
        const min_price = this.min_price.value;
        const coefficient = (max_price - min_price) / exponent;
        const start_u = new BN(start_utilization).div(weight);
        const end_u = new BN(end_utilization).div(weight);
        const delta = min_price * end_u.toNumber() -
            min_price * start_u.toNumber() +
            coefficient * Math.pow(end_u.toNumber(), exponent) -
            coefficient * Math.pow(start_u.toNumber(), exponent);
        return delta;
    }
    // Mimic: https://github.com/EOSIO/eosio.contracts/blob/d7bc0a5cc8c0c2edd4dc61b0126517d0cb46fd94/contracts/eosio.system/src/powerup.cpp#L262-L315
    fee(utilization_increase, adjusted_utilization) {
        const { utilization, weight } = this.cast();
        let start_utilization = utilization;
        const end_utilization = start_utilization + utilization_increase;
        let fee = 0;
        if (start_utilization < adjusted_utilization) {
            const min = Math.min(utilization_increase, adjusted_utilization - start_utilization);
            fee += Number(new bigDecimal(this.price_function(adjusted_utilization) * min)
                .divide(new bigDecimal(weight.toString()))
                .getValue());
            start_utilization = adjusted_utilization;
        }
        if (start_utilization < end_utilization) {
            fee += this.price_integral_delta(start_utilization, end_utilization);
        }
        return fee;
    }
    // Mimic: https://github.com/EOSIO/eosio.contracts/blob/d7bc0a5cc8c0c2edd4dc61b0126517d0cb46fd94/contracts/eosio.system/src/powerup.cpp#L105-L117
    determine_adjusted_utilization(options) {
        // Casting EOSIO types to usable formats for JS calculations
        const { decay_secs, utilization, utilization_timestamp } = this.cast();
        let { adjusted_utilization } = this.cast();
        // If utilization is less than adjusted, calculate real time value
        if (utilization < adjusted_utilization) {
            // Create now & adjust JS timestamp to match EOSIO timestamp values
            const ts = options && options.timestamp ? options.timestamp : new Date();
            const now = TimePointSec.from(ts).toMilliseconds() / 1000;
            const diff = adjusted_utilization - utilization;
            let delta = diff * Math.exp(-(now - utilization_timestamp) / decay_secs);
            delta = Math.min(Math.max(delta, 0), diff); // Clamp the delta
            adjusted_utilization = utilization + delta;
        }
        return adjusted_utilization;
    }
}
__decorate([
    Struct.field('uint8')
], PowerUpStateResource.prototype, "version", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "weight", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "weight_ratio", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "assumed_stake_weight", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "initial_weight_ratio", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "target_weight_ratio", void 0);
__decorate([
    Struct.field('time_point_sec')
], PowerUpStateResource.prototype, "initial_timestamp", void 0);
__decorate([
    Struct.field('time_point_sec')
], PowerUpStateResource.prototype, "target_timestamp", void 0);
__decorate([
    Struct.field('float64')
], PowerUpStateResource.prototype, "exponent", void 0);
__decorate([
    Struct.field('uint32')
], PowerUpStateResource.prototype, "decay_secs", void 0);
__decorate([
    Struct.field('asset')
], PowerUpStateResource.prototype, "min_price", void 0);
__decorate([
    Struct.field('asset')
], PowerUpStateResource.prototype, "max_price", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "utilization", void 0);
__decorate([
    Struct.field('int64')
], PowerUpStateResource.prototype, "adjusted_utilization", void 0);
__decorate([
    Struct.field('time_point_sec')
], PowerUpStateResource.prototype, "utilization_timestamp", void 0);

let PowerUpStateResourceCPU = class PowerUpStateResourceCPU extends PowerUpStateResource {
    constructor() {
        super(...arguments);
        // Return smallest units per day, μs (microseconds)
        this.per_day = (options) => this.us_per_day(options);
        // Default frac generation by smallest unit type
        this.frac = (usage, us) => this.frac_by_us(usage, us);
        // Frac generation by ms (milliseconds)
        this.frac_by_ms = (usage, ms) => this.frac_by_us(usage, ms * 1000);
        // Price generation by smallest units, μs (microseconds)
        this.price_per = (usage, us = 1000, options) => this.price_per_us(usage, us, options);
        // Price generation by ms (milliseconds)
        this.price_per_ms = (usage, ms = 1, options) => this.price_per_us(usage, ms * 1000, options);
    }
    // Return ms (milliseconds) per day
    ms_per_day(options) {
        return this.us_per_day(options) / 1000;
    }
    // Return μs (microseconds) per day
    us_per_day(options) {
        const limit = options && options.virtual_block_cpu_limit
            ? options.virtual_block_cpu_limit
            : this.default_block_cpu_limit;
        return Number(limit) * 2 * 60 * 60 * 24;
    }
    // Convert weight to μs (microseconds)
    weight_to_us(sample, weight) {
        return Math.ceil((weight * Number(sample)) / BNPrecision.toNumber());
    }
    // Convert μs (microseconds) to weight
    us_to_weight(sample, us) {
        return Math.floor((us / Number(sample)) * BNPrecision.toNumber());
    }
    // Frac generation by μs (microseconds)
    frac_by_us(usage, us) {
        const { weight } = this.cast();
        const frac = new BN(this.us_to_weight(usage.cpu, us)).div(weight);
        return Math.floor(frac.toNumber() * Math.pow(10, 15));
    }
    // Price generation by μs (microseconds)
    price_per_us(usage, us = 1000, options) {
        // Determine the utilization increase by this action
        const frac = UInt128.from(this.frac(usage, us));
        const utilization_increase = this.utilization_increase(usage.cpu, frac);
        // Determine the adjusted utilization if needed
        const adjusted_utilization = this.determine_adjusted_utilization(options);
        // Derive the fee from the increase and utilization
        const fee = this.fee(utilization_increase, adjusted_utilization);
        // Force the fee up to the next highest value of precision
        const precision = Math.pow(10, this.max_price.symbol.precision);
        const value = Math.ceil(fee * precision) / precision;
        // Return the modified fee
        return value;
    }
};
PowerUpStateResourceCPU = __decorate([
    Struct.type('powerupstateresourcecpu')
], PowerUpStateResourceCPU);

let PowerUpStateResourceNET = class PowerUpStateResourceNET extends PowerUpStateResource {
    constructor() {
        super(...arguments);
        // Return smallest units per day, bytes
        this.per_day = (options) => this.bytes_per_day(options);
        // Default frac generation by smallest unit type
        this.frac = (usage, bytes) => this.frac_by_bytes(usage, bytes);
        // Frac generation by kb
        this.frac_by_kb = (usage, kilobytes) => this.frac_by_bytes(usage, kilobytes * 1000);
        // Price generation by smallest units, bytes
        this.price_per = (usage, bytes = 1000, options) => this.price_per_byte(usage, bytes, options);
        // Price generation by kb
        this.price_per_kb = (usage, kilobytes = 1, options) => this.price_per_byte(usage, kilobytes * 1000, options);
    }
    // Return kb per day
    kb_per_day(options) {
        return this.bytes_per_day(options) / 1000;
    }
    // Return bytes per day
    bytes_per_day(options) {
        const limit = options && options.virtual_block_net_limit
            ? options.virtual_block_net_limit
            : this.default_block_net_limit;
        return Number(limit) * 2 * 60 * 60 * 24;
    }
    // Convert weight to bytes
    weight_to_bytes(sample, weight) {
        return Math.ceil((weight * Number(sample)) / BNPrecision.toNumber());
    }
    // Convert bytes to weight
    bytes_to_weight(sample, bytes) {
        return Math.floor((bytes / Number(sample)) * BNPrecision.toNumber());
    }
    // Frac generation by bytes
    frac_by_bytes(usage, bytes) {
        const { weight } = this.cast();
        const frac = new BN(this.bytes_to_weight(usage.net, bytes)).div(weight);
        return Math.floor(frac.toNumber() * Math.pow(10, 15));
    }
    // Price generation by bytes
    price_per_byte(usage, bytes = 1000, options) {
        // Determine the utilization increase by this action
        const frac = UInt128.from(this.frac(usage, bytes));
        const utilization_increase = this.utilization_increase(usage.net, frac);
        // Determine the adjusted utilization if needed
        const adjusted_utilization = this.determine_adjusted_utilization(options);
        // Derive the fee from the increase and utilization
        const fee = this.fee(utilization_increase, adjusted_utilization);
        // Force the fee up to the next highest value of precision
        const precision = Math.pow(10, this.max_price.symbol.precision);
        const value = Math.ceil(fee * precision) / precision;
        // Return the modified fee
        return value;
    }
};
PowerUpStateResourceNET = __decorate([
    Struct.type('powerupstateresourcenet')
], PowerUpStateResourceNET);

let PowerUpState = class PowerUpState extends Struct {
};
__decorate([
    Struct.field('uint8')
], PowerUpState.prototype, "version", void 0);
__decorate([
    Struct.field(PowerUpStateResourceNET)
], PowerUpState.prototype, "net", void 0);
__decorate([
    Struct.field(PowerUpStateResourceCPU)
], PowerUpState.prototype, "cpu", void 0);
__decorate([
    Struct.field('uint32')
], PowerUpState.prototype, "powerup_days", void 0);
__decorate([
    Struct.field('asset')
], PowerUpState.prototype, "min_powerup_fee", void 0);
PowerUpState = __decorate([
    Struct.type('powerupstate')
], PowerUpState);
class PowerUpAPI {
    constructor(parent) {
        this.parent = parent;
    }
    async get_state() {
        const response = await this.parent.api.v1.chain.get_table_rows({
            code: 'sysio',
            scope: '',
            table: 'powup.state',
            type: PowerUpState,
        });
        return response.rows[0];
    }
}

let Connector = class Connector extends Struct {
};
__decorate([
    Struct.field('asset')
], Connector.prototype, "balance", void 0);
__decorate([
    Struct.field('float64')
], Connector.prototype, "weight", void 0);
Connector = __decorate([
    Struct.type('connector')
], Connector);
let ExchangeState = class ExchangeState extends Struct {
};
__decorate([
    Struct.field('asset')
], ExchangeState.prototype, "supply", void 0);
__decorate([
    Struct.field(Connector)
], ExchangeState.prototype, "base", void 0);
__decorate([
    Struct.field(Connector)
], ExchangeState.prototype, "quote", void 0);
ExchangeState = __decorate([
    Struct.type('exchange_state')
], ExchangeState);
let RAMState = class RAMState extends ExchangeState {
    price_per(bytes) {
        const base = this.base.balance.units;
        const quote = this.quote.balance.units;
        return Asset.fromUnits(this.get_input(base, quote, Int64.from(bytes)), this.quote.balance.symbol);
    }
    price_per_kb(kilobytes) {
        return this.price_per(kilobytes * 1000);
    }
    // Derived from https://github.com/EOSIO/eosio.contracts/blob/f6578c45c83ec60826e6a1eeb9ee71de85abe976/contracts/eosio.system/src/exchange_state.cpp#L96
    get_input(base, quote, value) {
        // (quote * value) / (base - value), using 'ceil' to round up
        return quote.multiplying(value).dividing(base.subtracting(value), 'ceil');
    }
};
RAMState = __decorate([
    Struct.type('ramstate')
], RAMState);
class RAMAPI {
    constructor(parent) {
        this.parent = parent;
    }
    async get_state() {
        const response = await this.parent.api.v1.chain.get_table_rows({
            code: 'sysio',
            scope: 'sysio',
            table: 'rammarket',
            type: RAMState,
        });
        return response.rows[0];
    }
}

let REXState = class REXState extends Struct {
    get reserved() {
        return Number(this.total_lent.units) / Number(this.total_lendable.units);
    }
    get symbol() {
        return this.total_lent.symbol;
    }
    get precision() {
        return this.total_lent.symbol.precision;
    }
    get value() {
        return ((Number(this.total_lent.units) + Number(this.total_unlent.units)) /
            Number(this.total_rex.units));
    }
    exchange(amount) {
        return Asset.from((amount.value * this.total_lendable.value) / this.total_rex.value, this.symbol);
    }
    price_per(sample, unit = 1000) {
        // Sample token units
        const tokens = Asset.fromUnits(10000, this.symbol);
        // Spending 1 EOS (10000 units) on REX gives this many tokens
        const bancor = Number(tokens.units) / (this.total_rent.value / this.total_unlent.value);
        // The ratio of the number of tokens received vs the sampled values
        const unitPrice = bancor * (Number(sample.cpu) / BNPrecision.toNumber());
        // The token units spent per unit
        const perunit = Number(tokens.units) / unitPrice;
        // Multiply the per unit cost by the units requested
        const cost = perunit * unit;
        // Converting to an Asset
        return cost / Math.pow(10, this.precision);
    }
};
__decorate([
    Struct.field('uint8')
], REXState.prototype, "version", void 0);
__decorate([
    Struct.field('asset')
], REXState.prototype, "total_lent", void 0);
__decorate([
    Struct.field('asset')
], REXState.prototype, "total_unlent", void 0);
__decorate([
    Struct.field('asset')
], REXState.prototype, "total_rent", void 0);
__decorate([
    Struct.field('asset')
], REXState.prototype, "total_lendable", void 0);
__decorate([
    Struct.field('asset')
], REXState.prototype, "total_rex", void 0);
__decorate([
    Struct.field('asset')
], REXState.prototype, "namebid_proceeds", void 0);
__decorate([
    Struct.field('uint64')
], REXState.prototype, "loan_num", void 0);
REXState = __decorate([
    Struct.type('rexstate')
], REXState);
class REXAPI {
    constructor(parent) {
        this.parent = parent;
    }
    async get_state() {
        const response = await this.parent.api.v1.chain.get_table_rows({
            code: 'sysio',
            scope: 'sysio',
            table: 'rexpool',
            type: REXState,
        });
        return response.rows[0];
    }
}

const BNPrecision = new BN(100 * 1000 * 1000);
class Resources {
    constructor(options) {
        // the account to use when sampling usage
        this.sampleAccount = 'greymassfuel';
        // token precision/symbol
        this.symbol = '4,EOS';
        this.v1 = {
            powerup: new PowerUpAPI(this),
            ram: new RAMAPI(this),
            rex: new REXAPI(this),
        };
        // Allow overriding of the sample account name
        if (options.sampleAccount) {
            this.sampleAccount = options.sampleAccount;
        }
        // Allow overriding of the system token symbol
        if (options.symbol) {
            this.symbol = options.symbol;
        }
        // Allow variations on how to specify the API configuration
        if (options.api) {
            this.api = options.api;
        }
        else if (options.url) {
            this.api = new APIClient({
                provider: new FetchProvider(options.url, options),
            });
        }
        else {
            throw new Error('Missing url or api client');
        }
    }
    async getSampledUsage() {
        const account = await this.api.v1.chain.get_account(this.sampleAccount);
        const us = UInt128.from(account.cpu_limit.max.value.mul(BNPrecision));
        const byte = UInt128.from(account.net_limit.max.value.mul(BNPrecision));
        const cpu_weight = UInt128.from(account.cpu_weight.value);
        const net_weight = UInt128.from(account.net_weight.value);
        return {
            account,
            cpu: divCeil(us.value, cpu_weight.value),
            net: divCeil(byte.value, net_weight.value),
        };
    }
}
Resources.__className = 'Resources';
function divCeil(num, den) {
    let v = num.div(den);
    const zero = new BN(0);
    const one = new BN(1);
    if (num.mod(den).gt(zero) && v.gt(one)) {
        v = v.sub(one);
    }
    return UInt128.from(v);
}

/**
 * Base64u - URL-Safe Base64 variant no padding.
 * Based on https://gist.github.com/jonleighton/958841
 */
const baseCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const lookup = new Uint8Array(256);
for (let i = 0; i < 62; i++) {
    lookup[baseCharset.charCodeAt(i)] = i;
}
// support both urlsafe and standard base64
lookup[43] = lookup[45] = 62;
lookup[47] = lookup[95] = 63;
function encode(data, urlSafe = true) {
    const byteLength = data.byteLength;
    const byteRemainder = byteLength % 3;
    const mainLength = byteLength - byteRemainder;
    const charset = baseCharset + (urlSafe ? '-_' : '+/');
    const parts = [];
    let a;
    let b;
    let c;
    let d;
    let chunk;
    // Main loop deals with bytes in chunks of 3
    for (let i = 0; i < mainLength; i += 3) {
        // Combine the three bytes into a single integer
        chunk = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2];
        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       =  2^6 - 1
        // Convert the raw binary segments to the appropriate ASCII encoding
        parts.push(charset[a] + charset[b] + charset[c] + charset[d]);
    }
    // Deal with the remaining bytes
    if (byteRemainder === 1) {
        chunk = data[mainLength];
        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1
        parts.push(charset[a] + charset[b]);
    }
    else if (byteRemainder === 2) {
        chunk = (data[mainLength] << 8) | data[mainLength + 1];
        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1
        parts.push(charset[a] + charset[b] + charset[c]);
    }
    return parts.join('');
}
function decode(input) {
    const byteLength = input.length * 0.75;
    const data = new Uint8Array(byteLength);
    let a;
    let b;
    let c;
    let d;
    let p = 0;
    for (let i = 0; i < input.length; i += 4) {
        a = lookup[input.charCodeAt(i)];
        b = lookup[input.charCodeAt(i + 1)];
        c = lookup[input.charCodeAt(i + 2)];
        d = lookup[input.charCodeAt(i + 3)];
        data[p++] = (a << 2) | (b >> 4);
        data[p++] = ((b & 15) << 4) | (c >> 2);
        data[p++] = ((c & 3) << 6) | (d & 63);
    }
    return data;
}

var base64u = /*#__PURE__*/Object.freeze({
    __proto__: null,
    decode: decode,
    encode: encode
});

/** Chain ID aliases. */
var ChainName;
(function (ChainName) {
    ChainName[ChainName["UNKNOWN"] = 0] = "UNKNOWN";
    ChainName[ChainName["EOS"] = 1] = "EOS";
    ChainName[ChainName["TELOS"] = 2] = "TELOS";
    ChainName[ChainName["JUNGLE"] = 3] = "JUNGLE";
    ChainName[ChainName["KYLIN"] = 4] = "KYLIN";
    ChainName[ChainName["WORBLI"] = 5] = "WORBLI";
    ChainName[ChainName["BOS"] = 6] = "BOS";
    ChainName[ChainName["MEETONE"] = 7] = "MEETONE";
    ChainName[ChainName["INSIGHTS"] = 8] = "INSIGHTS";
    ChainName[ChainName["BEOS"] = 9] = "BEOS";
    ChainName[ChainName["WAX"] = 10] = "WAX";
    ChainName[ChainName["PROTON"] = 11] = "PROTON";
    ChainName[ChainName["FIO"] = 12] = "FIO";
})(ChainName || (ChainName = {}));
let ChainId = class ChainId extends Checksum256 {
    static from(value) {
        if (isInstanceOf(value, this)) {
            return value;
        }
        if (typeof value === 'number') {
            value = ChainIdLookup.get(value);
            if (!value) {
                throw new Error('Unknown chain id alias');
            }
        }
        return super.from(value);
    }
    get chainVariant() {
        const name = this.chainName;
        if (name !== ChainName.UNKNOWN) {
            return ChainIdVariant.from(['chain_alias', name]);
        }
        return ChainIdVariant.from(this);
    }
    get chainName() {
        const cid = this.hexString;
        for (const [n, id] of ChainIdLookup) {
            if (id === cid) {
                return n;
            }
        }
        return ChainName.UNKNOWN;
    }
};
ChainId = __decorate([
    TypeAlias('chain_id')
], ChainId);
let ChainAlias = class ChainAlias extends UInt8 {
};
ChainAlias = __decorate([
    TypeAlias('chain_alias')
], ChainAlias);
let ChainIdVariant = class ChainIdVariant extends Variant {
    get chainId() {
        if (isInstanceOf(this.value, ChainId)) {
            return this.value;
        }
        return ChainId.from(Number(this.value.value));
    }
};
ChainIdVariant = __decorate([
    Variant.type('variant_id', [ChainAlias, ChainId])
], ChainIdVariant);
const ChainIdLookup = new Map([
    [ChainName.EOS, 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'],
    [ChainName.TELOS, '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11'],
    [ChainName.JUNGLE, 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'],
    [ChainName.KYLIN, '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191'],
    [ChainName.WORBLI, '73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f'],
    [ChainName.BOS, 'd5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86'],
    [ChainName.MEETONE, 'cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422'],
    [ChainName.INSIGHTS, 'b042025541e25a472bffde2d62edd457b7e70cee943412b1ea0f044f88591664'],
    [ChainName.BEOS, 'b912d19a6abd2b1b05611ae5be473355d64d95aeff0c09bedc8c166cd6468fe4'],
    [ChainName.WAX, '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'],
    [ChainName.PROTON, '384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0'],
    [ChainName.FIO, '21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c'],
]);

/** SigningRequest ABI and typedefs. */
var RequestFlags_1;
let AccountName = class AccountName extends Name {
};
AccountName = __decorate([
    TypeAlias('account_name')
], AccountName);
let PermissionName = class PermissionName extends Name {
};
PermissionName = __decorate([
    TypeAlias('permission_name')
], PermissionName);
let IdentityV2 = class IdentityV2 extends Struct {
};
__decorate([
    Struct.field(PermissionLevel, { optional: true })
], IdentityV2.prototype, "permission", void 0);
IdentityV2 = __decorate([
    Struct.type('identity')
], IdentityV2);
let IdentityV3 = class IdentityV3 extends Struct {
};
__decorate([
    Struct.field('name')
], IdentityV3.prototype, "scope", void 0);
__decorate([
    Struct.field(PermissionLevel, { optional: true })
], IdentityV3.prototype, "permission", void 0);
IdentityV3 = __decorate([
    Struct.type('identity')
], IdentityV3);
let RequestVariantV2 = class RequestVariantV2 extends Variant {
};
RequestVariantV2 = __decorate([
    Variant.type('variant_req', [Action$1, { type: Action$1, array: true }, Transaction, IdentityV2])
], RequestVariantV2);
let RequestVariantV3 = class RequestVariantV3 extends Variant {
};
RequestVariantV3 = __decorate([
    Variant.type('variant_req', [Action$1, { type: Action$1, array: true }, Transaction, IdentityV3])
], RequestVariantV3);
let RequestFlags = RequestFlags_1 = class RequestFlags extends UInt8 {
    get broadcast() {
        return (Number(this) & RequestFlags_1.broadcast) !== 0;
    }
    set broadcast(enabled) {
        this.setFlag(RequestFlags_1.broadcast, enabled);
    }
    get background() {
        return (Number(this) & RequestFlags_1.background) !== 0;
    }
    set background(enabled) {
        this.setFlag(RequestFlags_1.background, enabled);
    }
    setFlag(flag, enabled) {
        if (enabled) {
            // TODO: implement bitwise operators in core, bn.js setbit does not work
            this.value = UInt8.from(Number(this) | flag).value;
        }
        else {
            this.value = UInt8.from(Number(this) & ~flag).value;
        }
    }
};
RequestFlags.broadcast = 1 << 0;
RequestFlags.background = 1 << 1;
RequestFlags = RequestFlags_1 = __decorate([
    TypeAlias('request_flags')
], RequestFlags);
let InfoPair = class InfoPair extends Struct {
};
__decorate([
    Struct.field('string')
], InfoPair.prototype, "key", void 0);
__decorate([
    Struct.field('bytes')
], InfoPair.prototype, "value", void 0);
InfoPair = __decorate([
    Struct.type('info_pair')
], InfoPair);
let RequestDataV2 = class RequestDataV2 extends Struct {
};
__decorate([
    Struct.field(ChainIdVariant)
], RequestDataV2.prototype, "chain_id", void 0);
__decorate([
    Struct.field(RequestVariantV2)
], RequestDataV2.prototype, "req", void 0);
__decorate([
    Struct.field(RequestFlags)
], RequestDataV2.prototype, "flags", void 0);
__decorate([
    Struct.field('string')
], RequestDataV2.prototype, "callback", void 0);
__decorate([
    Struct.field(InfoPair, { array: true })
], RequestDataV2.prototype, "info", void 0);
RequestDataV2 = __decorate([
    Struct.type('signing_request')
], RequestDataV2);
let RequestDataV3 = class RequestDataV3 extends Struct {
};
__decorate([
    Struct.field(ChainIdVariant)
], RequestDataV3.prototype, "chain_id", void 0);
__decorate([
    Struct.field(RequestVariantV3)
], RequestDataV3.prototype, "req", void 0);
__decorate([
    Struct.field(RequestFlags)
], RequestDataV3.prototype, "flags", void 0);
__decorate([
    Struct.field('string')
], RequestDataV3.prototype, "callback", void 0);
__decorate([
    Struct.field(InfoPair, { array: true })
], RequestDataV3.prototype, "info", void 0);
RequestDataV3 = __decorate([
    Struct.type('signing_request')
], RequestDataV3);
let RequestSignature = class RequestSignature extends Struct {
};
__decorate([
    Struct.field('name')
], RequestSignature.prototype, "signer", void 0);
__decorate([
    Struct.field('signature')
], RequestSignature.prototype, "signature", void 0);
RequestSignature = __decorate([
    Struct.type('request_signature')
], RequestSignature);

/**
 * SYSIO Signing Request (SSR).
 */
var IdentityProof_1;
// import { IdentityProof } from './identity-proof'
// import {IdentityProof} from './identity-proof'
/** Current supported protocol version, backwards compatible with version 2. */
const ProtocolVersion = 3;
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
const PlaceholderName = Name.from('............1'); // aka uint64(1)
/** Placeholder that will resolve to signer permission name. */
const PlaceholderPermission = Name.from('............2'); // aka uint64(2)
const PlaceholderAuth = PermissionLevel.from({
    actor: PlaceholderName,
    permission: PlaceholderPermission,
});
class SigningRequest {
    /** Return the identity ABI for given version. */
    static identityAbi(version) {
        const abi = Serializer.synthesize(this.identityType(version));
        abi.actions = [{ name: 'identity', type: 'identity', ricardian_contract: '' }];
        return abi;
    }
    /** Return the ABISerializableType identity type for given version. */
    static identityType(version) {
        return version === 2 ? IdentityV2 : IdentityV3;
    }
    /** Return the ABISerializableType storage type for given version. */
    static storageType(version) {
        return version === 2 ? RequestDataV2 : RequestDataV3;
    }
    /** Create a new signing request. */
    static async create(args, options = {}) {
        let actions;
        if (args.action) {
            actions = [args.action];
        }
        else if (args.actions) {
            actions = args.actions;
        }
        else if (args.transaction) {
            actions = args.transaction.actions || [];
        }
        else {
            actions = [];
        }
        const requiredAbis = actions
            .filter((action) => !Bytes.isBytes(action.data) &&
            action.data.constructor.abiName === undefined)
            .map((action) => Name.from(action.account));
        const abis = {};
        if (requiredAbis.length > 0) {
            const provider = options.abiProvider;
            if (!provider) {
                throw new Error('Missing abi provider');
            }
            const accountAbis = await Promise.all(requiredAbis.map((account) => provider.getAbi(account)));
            for (const [idx, abi] of accountAbis.entries()) {
                abis[requiredAbis[idx].toString()] = abi;
            }
        }
        return this.createSync(args, options, abis);
    }
    /**
     * Synchronously create a new signing request.
     * @throws If an un-encoded action with no abi def is encountered.
     */
    static createSync(args, options = {}, abis = {}) {
        let version = 2;
        const data = {};
        const encode = (action) => encodeAction(action, abis);
        // multi-chain requests requires version 3
        if (args.chainId === null) {
            version = 3;
        }
        // set the request data
        if (args.identity !== undefined) {
            if (args.identity.scope) {
                version = 3;
            }
            data.req = ['identity', this.identityType(version).from(args.identity)];
        }
        else if (args.action && !args.actions && !args.transaction) {
            data.req = ['action', encode(args.action)];
        }
        else if (args.actions && !args.action && !args.transaction) {
            if (args.actions.length === 1) {
                data.req = ['action', encode(args.actions[0])];
            }
            else {
                data.req = ['action[]', args.actions.map(encode)];
            }
        }
        else if (args.transaction && !args.action && !args.actions) {
            const tx = args.transaction;
            // set default values if missing
            if (tx.expiration === undefined) {
                tx.expiration = '1970-01-01T00:00:00.000';
            }
            if (tx.ref_block_num === undefined) {
                tx.ref_block_num = 0;
            }
            if (tx.ref_block_prefix === undefined) {
                tx.ref_block_prefix = 0;
            }
            if (tx.context_free_actions === undefined) {
                tx.context_free_actions = [];
            }
            if (tx.transaction_extensions === undefined) {
                tx.transaction_extensions = [];
            }
            if (tx.delay_sec === undefined) {
                tx.delay_sec = 0;
            }
            if (tx.max_cpu_usage_ms === undefined) {
                tx.max_cpu_usage_ms = 0;
            }
            if (tx.max_net_usage_words === undefined) {
                tx.max_net_usage_words = 0;
            }
            if (tx.actions === undefined) {
                tx.actions = [];
            }
            if (tx.context_free_actions === undefined) {
                tx.context_free_actions = [];
            }
            // encode actions if needed
            tx.actions = tx.actions.map(encode);
            data.req = ['transaction', tx];
        }
        else {
            throw new TypeError('Invalid arguments: Must have exactly one of action, actions or transaction');
        }
        // set the chain id
        if (args.chainId === null) {
            data.chain_id = ChainIdVariant.from(['chain_alias', 0]);
        }
        else {
            data.chain_id = ChainId.from(args.chainId || ChainName.EOS).chainVariant;
        }
        // request flags and callback
        const flags = RequestFlags.from(0);
        let callback = '';
        flags.broadcast =
            args.broadcast !== undefined ? args.broadcast : data.req[0] !== 'identity';
        if (typeof args.callback === 'string') {
            callback = args.callback;
        }
        else if (typeof args.callback === 'object') {
            callback = args.callback.url;
            flags.background = args.callback.background || false;
        }
        data.flags = flags;
        data.callback = callback;
        // info pairs
        data.info = [];
        if (typeof args.info === 'object') {
            for (const key in args.info) {
                const isOwn = Object.prototype.hasOwnProperty.call(args.info, key);
                if (isOwn) {
                    let value = args.info[key];
                    if (typeof value === 'string') {
                        value = Bytes.from(value, 'utf8');
                    }
                    else if (!(value instanceof Bytes)) {
                        value = Serializer.encode({ object: value });
                    }
                    data.info.push({ key, value });
                }
            }
        }
        if (args.chainIds && args.chainId === null) {
            const ids = args.chainIds.map((id) => ChainId.from(id).chainVariant);
            data.info.push({
                key: 'chain_ids',
                value: Serializer.encode({ object: ids, type: { type: ChainIdVariant, array: true } }),
            });
        }
        const req = new SigningRequest(version, this.storageType(version).from(data), options.zlib, options.abiProvider);
        // sign the request if given a signature provider
        if (options.signatureProvider) {
            req.sign(options.signatureProvider);
        }
        return req;
    }
    /** Creates an identity request. */
    static identity(args, options = {}) {
        let permission = {
            actor: args.account || PlaceholderName,
            permission: args.permission || PlaceholderPermission,
        };
        if (permission.actor === PlaceholderName &&
            permission.permission === PlaceholderPermission) {
            permission = undefined;
        }
        return this.createSync({
            ...args,
            identity: {
                permission,
                scope: args.scope,
            },
            broadcast: false,
        }, options);
    }
    /**
     * Create a request from a chain id and serialized transaction.
     * @param chainId The chain id where the transaction is valid.
     * @param serializedTransaction The serialized transaction.
     * @param options Creation options.
     */
    static fromTransaction(chainId, serializedTransaction, options = {}) {
        const id = ChainId.from(chainId);
        serializedTransaction = Bytes.from(serializedTransaction);
        const encoder = new ABIEncoder();
        encoder.writeByte(2); // header
        encoder.writeArray(Serializer.encode({ object: id.chainVariant }).array);
        encoder.writeByte(2); // transaction variant
        encoder.writeArray(Bytes.from(serializedTransaction).array);
        encoder.writeByte(RequestFlags.broadcast);
        encoder.writeByte(0); // callback
        encoder.writeByte(0); // info
        return SigningRequest.fromData(encoder.getData(), options);
    }
    /** Creates a signing request from encoded `esr:` uri string. */
    static from(uri, options = {}) {
        if (typeof uri !== 'string') {
            throw new Error('Invalid request uri');
        }
        const [, path] = uri.split(':');
        const data = decode(path.startsWith('//') ? path.slice(2) : path);
        return SigningRequest.fromData(data, options);
    }
    static fromData(data, options = {}) {
        data = Bytes.from(data);
        const header = data.array[0];
        const version = header & ~(1 << 7);
        if (version !== 2 && version !== 3) {
            throw new Error('Unsupported protocol version');
        }
        let payload = data.droppingFirst(1);
        if ((header & (1 << 7)) !== 0) {
            if (!options.zlib) {
                throw new Error('Compressed URI needs zlib');
            }
            payload = Bytes.from(options.zlib.inflateRaw(payload.array));
        }
        const decoder = new ABIDecoder(payload.array);
        const req = Serializer.decode({ data: decoder, type: this.storageType(version) });
        let sig;
        if (decoder.canRead()) {
            sig = Serializer.decode({ data: decoder, type: RequestSignature });
        }
        return new SigningRequest(version, req, options.zlib, options.abiProvider, sig);
    }
    /**
     * Create a new signing request.
     * Normally not used directly, see the `create` and `from` class methods.
     */
    constructor(version, data, zlib, abiProvider, signature) {
        if (data.flags.broadcast && data.req.variantName === 'identity') {
            throw new Error('Invalid request (identity request cannot be broadcast)');
        }
        this.version = version;
        this.data = data;
        this.zlib = zlib;
        this.abiProvider = abiProvider;
        this.signature = signature;
    }
    /**
     * Sign the request, mutating.
     * @param signatureProvider The signature provider that provides a signature for the signer.
     */
    sign(signatureProvider) {
        const message = this.getSignatureDigest();
        this.signature = RequestSignature.from(signatureProvider.sign(message));
    }
    /**
     * Get the signature digest for this request.
     */
    getSignatureDigest() {
        // protocol version + utf8 "request"
        const prefix = [this.version, 0x72, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74];
        return Checksum256.hash(Bytes.from(prefix).appending(this.getData()));
    }
    /**
     * Set the signature data for this request, mutating.
     * @param signer Account name of signer.
     * @param signature The signature string.
     */
    setSignature(signer, signature) {
        this.signature = RequestSignature.from({ signer, signature });
    }
    /**
     * Set the request callback, mutating.
     * @param url Where the callback should be sent.
     * @param background Whether the callback should be sent in the background.
     */
    setCallback(url, background) {
        this.data.callback = url;
        this.data.flags.background = background;
    }
    /**
     * Set broadcast flag.
     * @param broadcast Whether the transaction should be broadcast by receiver.
     */
    setBroadcast(broadcast) {
        this.data.flags.broadcast = broadcast;
    }
    /**
     * Encode this request into an `esr:` uri.
     * @argument compress Whether to compress the request data using zlib,
     *                    defaults to true if omitted and zlib is present;
     *                    otherwise false.
     * @argument slashes Whether add slashes after the protocol scheme, i.e. `esr://`.
     *                   Defaults to true.
     * @returns An esr uri string.
     */
    encode(compress, slashes, scheme = 'esr:') {
        const shouldCompress = compress !== undefined ? compress : this.zlib !== undefined;
        if (shouldCompress && this.zlib === undefined) {
            throw new Error('Need zlib to compress');
        }
        let header = this.version;
        const data = this.getData();
        const sigData = this.getSignatureData();
        let array = new Uint8Array(data.byteLength + sigData.byteLength);
        array.set(data, 0);
        array.set(sigData, data.byteLength);
        if (shouldCompress) {
            const deflated = this.zlib.deflateRaw(array);
            if (array.byteLength > deflated.byteLength) {
                header |= 1 << 7;
                array = deflated;
            }
        }
        const out = new Uint8Array(1 + array.byteLength);
        out[0] = header;
        out.set(array, 1);
        if (slashes !== false) {
            scheme += '//';
        }
        return scheme + encode(out);
    }
    /** Get the request data without header or signature. */
    getData() {
        return Serializer.encode({ object: this.data }).array;
    }
    /** Get signature data, returns an empty array if request is not signed. */
    getSignatureData() {
        if (!this.signature) {
            return new Uint8Array(0);
        }
        return Serializer.encode({ object: this.signature }).array;
    }
    /** ABI definitions required to resolve request. */
    getRequiredAbis() {
        return this.getRawActions()
            .filter((action) => !isIdentity(action))
            .map((action) => action.account)
            .filter((value, index, self) => self.indexOf(value) === index);
    }
    /** Whether TaPoS values are required to resolve request. */
    requiresTapos() {
        const tx = this.getRawTransaction();
        return !this.isIdentity() && !hasTapos(tx);
    }
    /** Resolve required ABI definitions. */
    async fetchAbis(abiProvider) {
        const required = this.getRequiredAbis();
        if (required.length > 0) {
            const provider = abiProvider || this.abiProvider;
            if (!provider) {
                throw new Error('Missing ABI provider');
            }
            const abis = new Map();
            await Promise.all(required.map(async (account) => {
                abis.set(account.toString(), ABI.from(await provider.getAbi(account)));
            }));
            return abis;
        }
        else {
            return new Map();
        }
    }
    /**
     * Decode raw actions actions to object representations.
     * @param abis ABI defenitions required to decode all actions.
     * @param signer Placeholders in actions will be resolved to signer if set.
     */
    resolveActions(abis, signer) {
        return this.getRawActions().map((rawAction) => {
            let abi;
            if (isIdentity(rawAction)) {
                abi = this.constructor.identityAbi(this.version);
            }
            else {
                const rawAbi = abis.get(rawAction.account.toString());
                if (!rawAbi) {
                    throw new Error(`Missing ABI definition for ${rawAction.account}`);
                }
                abi = ABI.from(rawAbi);
            }
            const type = abi.getActionType(rawAction.name);
            if (!type) {
                throw new Error(`Missing type for action ${rawAction.account}:${rawAction.name} in ABI`);
            }
            let data = rawAction.decodeData(abi);
            let authorization = rawAction.authorization;
            if (signer) {
                const signerPerm = PermissionLevel.from(signer);
                const resolve = (value) => {
                    if (value instanceof Name) {
                        if (value.equals(PlaceholderName)) {
                            return signerPerm.actor;
                        }
                        else if (value.equals(PlaceholderPermission)) {
                            return signerPerm.permission;
                        }
                        else {
                            return value;
                        }
                    }
                    else if (Array.isArray(value)) {
                        return value.map(resolve);
                    }
                    else if (typeof value === 'object' && value !== null) {
                        for (const key of Object.keys(value)) {
                            value[key] = resolve(value[key]);
                        }
                        return value;
                    }
                    else {
                        return value;
                    }
                };
                data = resolve(data);
                authorization = authorization.map((auth) => {
                    let { actor, permission } = auth;
                    if (actor.equals(PlaceholderName)) {
                        actor = signerPerm.actor;
                    }
                    if (permission.equals(PlaceholderPermission)) {
                        permission = signerPerm.permission;
                    }
                    // backwards compatibility, actor placeholder will also resolve to permission when used in auth
                    if (permission.equals(PlaceholderName)) {
                        permission = signerPerm.permission;
                    }
                    return PermissionLevel.from({ actor, permission });
                });
            }
            return {
                ...rawAction,
                authorization,
                data,
            };
        });
    }
    resolveTransaction(abis, signer, ctx = {}) {
        const tx = this.getRawTransaction();
        if (!this.isIdentity() && !hasTapos(tx)) {
            if (ctx.expiration !== undefined &&
                ctx.ref_block_num !== undefined &&
                ctx.ref_block_prefix !== undefined) {
                tx.expiration = TimePointSec.from(ctx.expiration);
                tx.ref_block_num = UInt16.from(ctx.ref_block_num, 'truncate');
                tx.ref_block_prefix = UInt32.from(ctx.ref_block_prefix);
            }
            else if (ctx.block_num !== undefined &&
                ctx.ref_block_prefix !== undefined &&
                ctx.timestamp !== undefined) {
                tx.expiration = expirationTime(ctx.timestamp, ctx.expire_seconds);
                tx.ref_block_num = UInt16.from(ctx.block_num, 'truncate');
                tx.ref_block_prefix = UInt32.from(ctx.ref_block_prefix);
            }
            else {
                throw new Error('Invalid transaction context, need either a reference block or explicit TaPoS values');
            }
        }
        else if (this.isIdentity() && this.version > 2) {
            // From ESR version 3 all identity requests have expiration
            tx.expiration = ctx.expiration
                ? TimePointSec.from(ctx.expiration)
                : expirationTime(ctx.timestamp, ctx.expire_seconds);
        }
        const actions = this.resolveActions(abis, signer);
        // TODO: resolve context free actions
        const context_free_actions = tx.context_free_actions;
        return { ...tx, context_free_actions, actions };
    }
    resolve(abis, signer, ctx = {}) {
        const tx = this.resolveTransaction(abis, signer, ctx);
        const actions = tx.actions.map((action) => {
            let abi;
            if (isIdentity(action)) {
                abi = this.constructor.identityAbi(this.version);
            }
            else {
                abi = abis.get(action.account.toString());
            }
            if (!abi) {
                throw new Error(`Missing ABI definition for ${action.account}`);
            }
            const type = abi.getActionType(action.name);
            const data = Serializer.encode({ object: action.data, type, abi });
            return Action$1.from({ ...action, data });
        });
        const transaction = Transaction.from({ ...tx, actions });
        let chainId;
        if (this.isMultiChain()) {
            if (!ctx.chainId) {
                throw new Error('Missing chosen chain ID for multi-chain request');
            }
            chainId = ChainId.from(ctx.chainId);
            const ids = this.getChainIds();
            if (ids && !ids.some((id) => chainId.equals(id))) {
                throw new Error('Trying to resolve for chain ID not defined in request');
            }
        }
        else {
            chainId = this.getChainId();
        }
        return new ResolvedSigningRequest(this, PermissionLevel.from(signer), transaction, tx, chainId);
    }
    /**
     * Get the id of the chain where this request is valid.
     * @returns The 32-byte chain id as hex encoded string.
     */
    getChainId() {
        return this.data.chain_id.chainId;
    }
    /**
     * Chain IDs this request is valid for, only valid for multi chain requests. Value of `null` when `isMultiChain` is true denotes any chain.
     */
    getChainIds() {
        if (!this.isMultiChain()) {
            return null;
        }
        const ids = this.getInfoKey('chain_ids', { type: ChainIdVariant, array: true });
        if (ids) {
            return ids.map((id) => id.chainId);
        }
        return null;
    }
    /**
     * Set chain IDs this request is valid for, only considered for multi chain requests.
     */
    setChainIds(ids) {
        const value = ids.map((id) => ChainId.from(id).chainVariant);
        this.setInfoKey('chain_ids', value, { type: ChainIdVariant, array: true });
    }
    /**
     * True if chainId is set to chain alias `0` which indicates that the request is valid for any chain.
     */
    isMultiChain() {
        return (this.data.chain_id.variantIdx === 0 &&
            this.data.chain_id.value.equals(ChainName.UNKNOWN));
    }
    /** Return the actions in this request with action data encoded. */
    getRawActions() {
        const req = this.data.req;
        switch (req.variantName) {
            case 'action':
                return [req.value];
            case 'action[]':
                return req.value;
            case 'identity': {
                if (this.version === 2) {
                    const id = req.value;
                    let data = '0101000000000000000200000000000000'; // placeholder permission
                    let authorization = [PlaceholderAuth];
                    if (id.permission) {
                        data = Serializer.encode({ object: id });
                        authorization = [id.permission];
                    }
                    const action = Action$1.from({
                        account: '',
                        name: 'identity',
                        authorization,
                        data,
                    });
                    // TODO: The way payloads are encoded is including the ABI, which isn't what we want
                    // This needs to be resolved in wharfkit/antelope, and then the delete call here should be removed
                    delete action.abi;
                    return [action];
                }
                else {
                    // eslint-disable-next-line prefer-const
                    let { scope, permission } = req.value;
                    if (!permission) {
                        permission = PlaceholderAuth;
                    }
                    const data = Serializer.encode({ object: { scope, permission }, type: IdentityV3 });
                    const action = Action$1.from({
                        account: '',
                        name: 'identity',
                        authorization: [permission],
                        data,
                    });
                    // TODO: The way payloads are encoded is including the ABI, which isn't what we want
                    // This needs to be resolved in wharfkit/antelope, and then the delete call here should be removed
                    delete action.abi;
                    return [action];
                }
            }
            case 'transaction':
                return req.value.actions;
            default:
                throw new Error('Invalid signing request data');
        }
    }
    /** Unresolved transaction. */
    getRawTransaction() {
        const req = this.data.req;
        switch (req.variantName) {
            case 'transaction':
                return Transaction.from({ ...req.value });
            case 'action':
            case 'action[]':
            case 'identity':
                return Transaction.from({
                    actions: this.getRawActions(),
                    context_free_actions: [],
                    transaction_extensions: [],
                    expiration: '1970-01-01T00:00:00.000',
                    ref_block_num: 0,
                    ref_block_prefix: 0,
                    max_cpu_usage_ms: 0,
                    max_net_usage_words: 0,
                    delay_sec: 0,
                });
            default:
                throw new Error('Invalid signing request data');
        }
    }
    /** Whether the request is an identity request. */
    isIdentity() {
        return this.data.req.variantName === 'identity';
    }
    /** Whether the request should be broadcast by signer. */
    shouldBroadcast() {
        if (this.isIdentity()) {
            return false;
        }
        return this.data.flags.broadcast;
    }
    /**
     * Present if the request is an identity request and requests a specific account.
     * @note This returns `nil` unless a specific identity has been requested,
     *       use `isIdentity` to check id requests.
     */
    getIdentity() {
        if (!this.isIdentity()) {
            return null;
        }
        const id = this.data.req.value;
        if (id.permission && !id.permission.actor.equals(PlaceholderName)) {
            return id.permission.actor;
        }
        return null;
    }
    /**
     * Present if the request is an identity request and requests a specific permission.
     * @note This returns `nil` unless a specific permission has been requested,
     *       use `isIdentity` to check id requests.
     */
    getIdentityPermission() {
        if (!this.isIdentity()) {
            return null;
        }
        const id = this.data.req.value;
        if (id.permission && !id.permission.permission.equals(PlaceholderPermission)) {
            return id.permission.permission;
        }
        return null;
    }
    /**
     * Present if the request is an identity request and requests a specific permission.
     * @note This returns `nil` unless a specific permission has been requested,
     *       use `isIdentity` to check id requests.
     */
    getIdentityScope() {
        if (!this.isIdentity() || this.version <= 2) {
            return null;
        }
        const id = this.data.req.value;
        return id.scope;
    }
    /** Get raw info dict */
    getRawInfo() {
        const rv = {};
        for (const { key, value } of this.data.info) {
            rv[key] = value;
        }
        return rv;
    }
    getRawInfoKey(key) {
        const pair = this.data.info.find((pair) => pair.key === key);
        if (pair) {
            return pair.value;
        }
    }
    setRawInfoKey(key, value) {
        let pair = this.data.info.find((pair) => pair.key === key);
        if (!pair) {
            pair = InfoPair.from({ key, value });
            this.data.info.push(pair);
        }
        else {
            pair.value = Bytes.from(value);
        }
    }
    /** Set a metadata key. */
    setInfoKey(key, object, type) {
        let data;
        if (typeof object === 'string' && !type) {
            // match old behavior where strings encode to raw utf8 as opposed to
            // eosio-abi encoded strings (varuint32 length prefix + utf8 bytes)
            data = Bytes.from(object, 'utf8');
        }
        else {
            data = Serializer.encode({ object, type });
        }
        this.setRawInfoKey(key, data);
    }
    getInfoKey(key, type) {
        const data = this.getRawInfoKey(key);
        if (data) {
            if (type) {
                return Serializer.decode({ data, type });
            }
            else {
                // assume utf8 string if no type is given
                return data.utf8String;
            }
        }
    }
    /** Return a deep copy of this request. */
    clone() {
        let signature;
        if (this.signature) {
            signature = RequestSignature.from(JSON.parse(JSON.stringify(this.signature)));
        }
        const RequestData = this.constructor.storageType(this.version);
        const data = RequestData.from(JSON.parse(JSON.stringify(this.data)));
        return new SigningRequest(this.version, data, this.zlib, this.abiProvider, signature);
    }
    // Convenience methods.
    toString() {
        return this.encode();
    }
    toJSON() {
        return this.encode();
    }
}
class ResolvedSigningRequest {
    /** Recreate a resolved request from a callback payload. */
    static async fromPayload(payload, options = {}) {
        const request = SigningRequest.from(payload.req, options);
        const abis = await request.fetchAbis();
        return request.resolve(abis, { actor: payload.sa, permission: payload.sp }, {
            ref_block_num: payload.rbn,
            ref_block_prefix: payload.rid,
            expiration: payload.ex,
            chainId: payload.cid || request.getChainId(),
        });
    }
    constructor(request, signer, transaction, resolvedTransaction, chainId) {
        this.request = request;
        this.signer = signer;
        this.transaction = transaction;
        this.resolvedTransaction = resolvedTransaction;
        this.chainId = chainId;
    }
    get serializedTransaction() {
        return Serializer.encode({ object: this.transaction }).array;
    }
    get signingDigest() {
        return this.transaction.signingDigest(this.chainId);
    }
    get signingData() {
        return this.transaction.signingData(this.chainId);
    }
    getCallback(signatures, blockNum) {
        const { callback, flags } = this.request.data;
        if (!callback || callback.length === 0) {
            return null;
        }
        if (!signatures || signatures.length === 0) {
            throw new Error('Must have at least one signature to resolve callback');
        }
        const sigs = signatures.map((sig) => Signature.from(sig));
        const payload = {
            sig: String(sigs[0]),
            tx: String(this.transaction.id),
            rbn: String(this.transaction.ref_block_num),
            rid: String(this.transaction.ref_block_prefix),
            ex: String(this.transaction.expiration),
            req: this.request.encode(),
            sa: String(this.signer.actor),
            sp: String(this.signer.permission),
            cid: String(this.chainId),
        };
        for (const [n, sig] of sigs.slice(1).entries()) {
            payload[`sig${n}`] = String(sig);
        }
        if (blockNum) {
            payload.bn = String(UInt32.from(blockNum));
        }
        const url = callback.replace(/({{([a-z0-9]+)}})/g, (_1, _2, m) => {
            return payload[m] || '';
        });
        return {
            background: flags.background,
            payload,
            url,
        };
    }
    getIdentityProof(signature) {
        if (!this.request.isIdentity()) {
            throw new Error('Not a identity request');
        }
        return IdentityProof.from({
            chainId: this.chainId,
            scope: this.request.getIdentityScope(),
            expiration: this.transaction.expiration,
            signer: this.signer,
            signature,
        });
    }
}
function encodeAction(action, abis) {
    if (Bytes.isBytes(action.data) || action.data.constructor.abiName !== undefined) {
        return Action$1.from(action);
    }
    const abi = abis[String(Name.from(action.account))];
    if (!abi) {
        throw new Error(`Missing ABI for ${action.account}`);
    }
    const data = Action$1.from(action, abi);
    // TODO: The way payloads are encoded is including the ABI, which isn't what we want
    // This needs to be resolved in wharfkit/antelope, and then the delete call here should be removed
    delete data.abi;
    return data;
}
function isIdentity(action) {
    const account = Name.from(action.account);
    const name = Name.from(action.name);
    return account.rawValue.equals(0) && name.equals('identity');
}
function hasTapos(tx) {
    return !(tx.expiration.equals(0) &&
        tx.ref_block_num.equals(0) &&
        tx.ref_block_prefix.equals(0));
}
function expirationTime(timestamp, expireSeconds = 60) {
    const ts = TimePointSec.from(timestamp || new Date());
    const exp = UInt32.from(expireSeconds);
    return TimePointSec.fromInteger(ts.value.adding(exp));
}
let IdentityProof = IdentityProof_1 = class IdentityProof extends Struct {
    static from(value) {
        if (isInstanceOf(value, IdentityProof_1)) {
            return value;
        }
        else if (typeof value === 'string') {
            return IdentityProof_1.fromString(value);
        }
        else {
            return super.from(value);
        }
    }
    /**
     * Create a new instance from an SYSIO authorization header string.
     * "SYSIO <base64payload>"
     */
    static fromString(string) {
        const parts = string.split(' ');
        if (parts.length !== 2 || parts[0] !== 'SYSIO') {
            throw new Error('Invalid IdentityProof string');
        }
        const data = decode(parts[1]);
        return Serializer.decode({ data, type: IdentityProof_1 });
    }
    /** Create a new instance from a callback payload. */
    static fromPayload(payload, options = {}) {
        const request = SigningRequest.from(payload.req, options);
        if (!(request.version >= 3 && request.isIdentity())) {
            throw new Error('Not an identity request');
        }
        return this.from({
            chainId: payload.cid || request.getChainId(),
            scope: request.getIdentityScope(),
            expiration: payload.ex,
            signer: { actor: payload.sa, permission: payload.sp },
            signature: payload.sig,
        });
    }
    /**
     * Transaction this proof resolves to.
     * @internal
     */
    get transaction() {
        const action = Action$1.from({
            account: '',
            name: 'identity',
            authorization: [this.signer],
            data: IdentityV3.from({ scope: this.scope, permission: this.signer }),
        });
        return Transaction.from({
            ref_block_num: 0,
            ref_block_prefix: 0,
            expiration: this.expiration,
            actions: [action],
        });
    }
    /**
     * Recover the public key that signed this proof.
     */
    recover() {
        return this.signature.recoverDigest(this.transaction.signingDigest(this.chainId));
    }
    /**
     * Verify that given authority signed this proof.
     * @param auth The accounts signing authority.
     * @param currentTime Time to verify expiry against, if unset will use system time.
     */
    verify(auth, currentTime) {
        const now = TimePointSec.from(currentTime || new Date()).toMilliseconds();
        return (now < this.expiration.toMilliseconds() &&
            Authority.from(auth).hasPermission(this.recover()));
    }
    /**
     * Encode the proof to an `SYSIO` auth header string.
     */
    toString() {
        const data = Serializer.encode({ object: this });
        return `SYSIO ${encode(data.array, false)}`;
    }
};
__decorate([
    Struct.field(ChainId)
], IdentityProof.prototype, "chainId", void 0);
__decorate([
    Struct.field(Name)
], IdentityProof.prototype, "scope", void 0);
__decorate([
    Struct.field(TimePointSec)
], IdentityProof.prototype, "expiration", void 0);
__decorate([
    Struct.field(PermissionLevel)
], IdentityProof.prototype, "signer", void 0);
__decorate([
    Struct.field(Signature)
], IdentityProof.prototype, "signature", void 0);
IdentityProof = IdentityProof_1 = __decorate([
    Struct.type('identity_proof')
], IdentityProof);

/**
 * Given an APIClient instance, this class provides an AbiProvider interface for retrieving and caching ABIs.
 */
class ABICache {
    constructor(client) {
        this.client = client;
        this.cache = new Map();
        this.pending = new Map();
    }
    async getAbi(account) {
        const key = String(account);
        let record = this.cache.get(key);
        if (!record) {
            let getAbi = this.pending.get(key);
            if (!getAbi) {
                getAbi = this.client.v1.chain.get_raw_abi(account);
                this.pending.set(key, getAbi);
            }
            const response = await getAbi;
            this.pending.delete(key);
            if (response.abi) {
                record = ABI.from(response.abi);
                this.cache.set(key, record);
            }
            else {
                throw new Error(`ABI for ${key} could not be loaded.`);
            }
        }
        return record;
    }
    setAbi(account, abiDef, merge = false) {
        const key = String(account);
        const abi = ABI.from(abiDef);
        const existing = this.cache.get(key);
        if (merge && existing) {
            this.cache.set(key, ABI.from({
                action_results: mergeAndDeduplicate(existing.action_results, abi.action_results),
                types: mergeAndDeduplicate(existing.types, abi.types),
                structs: mergeAndDeduplicate(existing.structs, abi.structs),
                actions: mergeAndDeduplicate(existing.actions, abi.actions),
                tables: mergeAndDeduplicate(existing.tables, abi.tables),
                ricardian_clauses: mergeAndDeduplicate(existing.ricardian_clauses, abi.ricardian_clauses),
                variants: mergeAndDeduplicate(existing.variants, abi.variants),
                version: abi.version,
            }));
        }
        else {
            this.cache.set(key, abi);
        }
    }
}
function mergeAndDeduplicate(array1, array2) {
    return [...array1, ...array2].reduce((acc, current) => {
        if (!acc.some((obj) => String(obj.name) === String(current.name))) {
            acc.push(current);
        }
        return acc;
    }, []);
}

export { ABI, ABICache, ABIDecoder, ABIEncoder, types$1 as API, APIClient, APIError, AccountName, Action$1 as Action, Asset, Authority, BNPrecision, Base58, base64u as Base64u, Blob, BlockId, BlockTimestamp, Bytes, Canceled, ChainAPI, ChainAlias, ChainDefinition, ChainId, ChainIdVariant, ChainName, ChainNames, Chains, Checksum160, Checksum256, Checksum512, CompressionType, Connector, ExchangeState, ExplorerDefinition, ExtendedAsset, ExtendedSymbol, FetchProvider, Float128, Float32, Float64, HistoryAPI, IdentityProof, IdentityV2, IdentityV3, InfoPair, Int, Int128, Int16, Int32, Int64, Int8, KeyType, KeyWeight, Logo, Name, types as P2P, P2PClient, PackedTransaction, PermissionLevel, PermissionLevelWeight, PermissionName, PlaceholderAuth, PlaceholderName, PlaceholderPermission, PowerUpAPI, PowerUpState, PrivateKey, ProtocolVersion, PublicKey, RAMAPI, RAMState, REXAPI, REXState, RequestDataV2, RequestDataV3, RequestFlags, RequestSignature, RequestVariantV2, RequestVariantV3, ResolvedSigningRequest, Resources, Serializer, Signature, SignedTransaction, SigningRequest, SimpleEnvelopeP2PProvider, Struct, TelosAccountObject, TelosAccountVoterInfo, TimePoint, TimePointSec, Transaction, TransactionExtension, TransactionHeader, TransactionReceipt, TypeAlias, UInt128, UInt16, UInt256, UInt32, UInt64, UInt8, VarInt, VarUInt, Variant, WAXAccountObject, WAXAccountVoterInfo, WaitWeight, Weight, arrayEquals, arrayEquatableEquals, arrayToHex, cancelable, chainIdsToIndices, chainLogos, getCurve, hexToArray, isInstanceOf, secureRandom };
//# sourceMappingURL=core.m.js.map
