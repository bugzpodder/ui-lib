// @flow
/**
 * Copyright (c) 2013 IETF Trust and Sebastian Wiedenroth. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * • Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * • Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * • Neither the name of Internet Society, IETF or IETF Trust, nor the
 * names of specific contributors, may be used to endorse or promote
 * products derived from this software without specific prior written
 * permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS
 * IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * fnv-1 hash implementation. This is implemented here because node packages only seem to support fnv-1a
 * hash algorithms. The only difference between fnv-1 and fnv-1a is the order of the XOR and multiplication.
 * For more information, see the following: https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
 */
export const fnv1 = (data: string | Buffer) => {
	// Offset basis.
	let hash = 0x811c9dc5;
	// istanbul ignore else
	if (typeof data === "string") {
		data = new Buffer(data);
	} else if (!(data instanceof Buffer)) {
		throw Error("expected a 'string' or 'Buffer'");
	}

	for (let i = 0; i < data.length; ++i) {
		// 32 bit FNV_Prime = 2^24 + 2^8 + 0x93.
		hash += (hash << 24) + (hash << 8) + (hash << 7) + (hash << 4) + (hash << 1);
		hash = hash ^ data[i];
	}

	return hash & 0xffffffff;
};
