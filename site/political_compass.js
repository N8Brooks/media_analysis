// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const N_FEATURES = 2 ** 18;
class Stemmer {
    current;
    cursor;
    limit;
    limit_backward;
    bra;
    ket;
    stem(word) {
        this.current = word;
        this.cursor = 0;
        this.limit = this.current.length;
        this.limit_backward = 0;
        this.bra = this.cursor;
        this.ket = this.limit;
        this._stemHelper();
        return this.current;
    }
    in_grouping(s, min, max) {
        if (this.cursor >= this.limit) return false;
        let ch = this.current.charCodeAt(this.cursor);
        if (ch > max || ch < min) return false;
        ch -= min;
        if ((s[ch >>> 3] & 1 << (ch & 7)) == 0) return false;
        this.cursor++;
        return true;
    }
    in_grouping_b(s, min, max) {
        if (this.cursor <= this.limit_backward) return false;
        let ch = this.current.charCodeAt(this.cursor - 1);
        if (ch > max || ch < min) return false;
        ch -= min;
        if ((s[ch >>> 3] & 1 << (ch & 7)) == 0) return false;
        this.cursor--;
        return true;
    }
    out_grouping(s, min, max) {
        if (this.cursor >= this.limit) return false;
        let ch = this.current.charCodeAt(this.cursor);
        if (ch > max || ch < min) {
            this.cursor++;
            return true;
        }
        ch -= min;
        if ((s[ch >>> 3] & 1 << (ch & 7)) == 0) {
            this.cursor++;
            return true;
        }
        return false;
    }
    out_grouping_b(s, min, max) {
        if (this.cursor <= this.limit_backward) return false;
        let ch = this.current.charCodeAt(this.cursor - 1);
        if (ch > max || ch < min) {
            this.cursor--;
            return true;
        }
        ch -= min;
        if ((s[ch >>> 3] & 1 << (ch & 7)) == 0) {
            this.cursor--;
            return true;
        }
        return false;
    }
    eq_s(s) {
        if (this.limit - this.cursor < s.length) return false;
        if (this.current.slice(this.cursor, this.cursor + s.length) != s) {
            return false;
        }
        this.cursor += s.length;
        return true;
    }
    eq_s_b(s) {
        if (this.cursor - this.limit_backward < s.length) return false;
        if (this.current.slice(this.cursor - s.length, this.cursor) != s) {
            return false;
        }
        this.cursor -= s.length;
        return true;
    }
    find_among(v) {
        let i = 0;
        let j = v.length;
        const c = this.cursor;
        const l = this.limit;
        let common_i = 0;
        let common_j = 0;
        let first_key_inspected = false;
        while(true){
            const k = i + (j - i >>> 1);
            let diff = 0;
            let common = common_i < common_j ? common_i : common_j;
            const w = v[k];
            let i2;
            for(i2 = common; i2 < w[0].length; i2++){
                if (c + common == l) {
                    diff = -1;
                    break;
                }
                diff = this.current.charCodeAt(c + common) - w[0].charCodeAt(i2);
                if (diff != 0) break;
                common++;
            }
            if (diff < 0) {
                j = k;
                common_j = common;
            } else {
                i = k;
                common_i = common;
            }
            if (j - i <= 1) {
                if (i > 0) break;
                if (j == i) break;
                if (first_key_inspected) break;
                first_key_inspected = true;
            }
        }
        do {
            const w = v[i];
            if (common_i >= w[0].length) {
                this.cursor = c + w[0].length;
                if (w.length < 4) return w[2];
                const res = w[3](this);
                this.cursor = c + w[0].length;
                if (res) return w[2];
            }
            i = w[1];
        }while (i >= 0)
        return 0;
    }
    find_among_b(v) {
        let i = 0;
        let j = v.length;
        const c = this.cursor;
        const lb = this.limit_backward;
        let common_i = 0;
        let common_j = 0;
        let first_key_inspected = false;
        while(true){
            const k = i + (j - i >> 1);
            let diff = 0;
            let common = common_i < common_j ? common_i : common_j;
            const w = v[k];
            let i2;
            for(i2 = w[0].length - 1 - common; i2 >= 0; i2--){
                if (c - common == lb) {
                    diff = -1;
                    break;
                }
                diff = this.current.charCodeAt(c - 1 - common) - w[0].charCodeAt(i2);
                if (diff != 0) break;
                common++;
            }
            if (diff < 0) {
                j = k;
                common_j = common;
            } else {
                i = k;
                common_i = common;
            }
            if (j - i <= 1) {
                if (i > 0) break;
                if (j == i) break;
                if (first_key_inspected) break;
                first_key_inspected = true;
            }
        }
        do {
            const w = v[i];
            if (common_i >= w[0].length) {
                this.cursor = c - w[0].length;
                if (w.length < 4) return w[2];
                const res = w[3](this);
                this.cursor = c - w[0].length;
                if (res) return w[2];
            }
            i = w[1];
        }while (i >= 0)
        return 0;
    }
    replace_s(c_bra, c_ket, s) {
        const adjustment = s.length - (c_ket - c_bra);
        this.current = this.current.slice(0, c_bra) + s + this.current.slice(c_ket);
        this.limit += adjustment;
        if (this.cursor >= c_ket) this.cursor += adjustment;
        else if (this.cursor > c_bra) this.cursor = c_bra;
        return adjustment;
    }
    slice_check() {
        if (this.bra < 0 || this.bra > this.ket || this.ket > this.limit || this.limit > this.current.length) {
            return false;
        }
        return true;
    }
    slice_from(s) {
        let result = false;
        if (this.slice_check()) {
            this.replace_s(this.bra, this.ket, s);
            result = true;
        }
        return result;
    }
    slice_del() {
        return this.slice_from("");
    }
    insert(c_bra, c_ket, s) {
        const adjustment = this.replace_s(c_bra, c_ket, s);
        if (c_bra <= this.bra) this.bra += adjustment;
        if (c_bra <= this.ket) this.ket += adjustment;
    }
    slice_to() {
        let result = "";
        if (this.slice_check()) {
            result = this.current.slice(this.bra, this.ket);
        }
        return result;
    }
}
const a_0 = [
    [
        "arsen",
        -1,
        -1
    ],
    [
        "commun",
        -1,
        -1
    ],
    [
        "gener",
        -1,
        -1
    ], 
];
const a_1 = [
    [
        "'",
        -1,
        1
    ],
    [
        "'s'",
        0,
        1
    ],
    [
        "'s",
        -1,
        1
    ], 
];
const a_2 = [
    [
        "ied",
        -1,
        2
    ],
    [
        "s",
        -1,
        3
    ],
    [
        "ies",
        1,
        2
    ],
    [
        "sses",
        1,
        1
    ],
    [
        "ss",
        1,
        -1
    ],
    [
        "us",
        1,
        -1
    ], 
];
const a_3 = [
    [
        "",
        -1,
        3
    ],
    [
        "bb",
        0,
        2
    ],
    [
        "dd",
        0,
        2
    ],
    [
        "ff",
        0,
        2
    ],
    [
        "gg",
        0,
        2
    ],
    [
        "bl",
        0,
        1
    ],
    [
        "mm",
        0,
        2
    ],
    [
        "nn",
        0,
        2
    ],
    [
        "pp",
        0,
        2
    ],
    [
        "rr",
        0,
        2
    ],
    [
        "at",
        0,
        1
    ],
    [
        "tt",
        0,
        2
    ],
    [
        "iz",
        0,
        1
    ], 
];
const a_4 = [
    [
        "ed",
        -1,
        2
    ],
    [
        "eed",
        0,
        1
    ],
    [
        "ing",
        -1,
        2
    ],
    [
        "edly",
        -1,
        2
    ],
    [
        "eedly",
        3,
        1
    ],
    [
        "ingly",
        -1,
        2
    ], 
];
const a_5 = [
    [
        "anci",
        -1,
        3
    ],
    [
        "enci",
        -1,
        2
    ],
    [
        "ogi",
        -1,
        13
    ],
    [
        "li",
        -1,
        15
    ],
    [
        "bli",
        3,
        12
    ],
    [
        "abli",
        4,
        4
    ],
    [
        "alli",
        3,
        8
    ],
    [
        "fulli",
        3,
        9
    ],
    [
        "lessli",
        3,
        14
    ],
    [
        "ousli",
        3,
        10
    ],
    [
        "entli",
        3,
        5
    ],
    [
        "aliti",
        -1,
        8
    ],
    [
        "biliti",
        -1,
        12
    ],
    [
        "iviti",
        -1,
        11
    ],
    [
        "tional",
        -1,
        1
    ],
    [
        "ational",
        14,
        7
    ],
    [
        "alism",
        -1,
        8
    ],
    [
        "ation",
        -1,
        7
    ],
    [
        "ization",
        17,
        6
    ],
    [
        "izer",
        -1,
        6
    ],
    [
        "ator",
        -1,
        7
    ],
    [
        "iveness",
        -1,
        11
    ],
    [
        "fulness",
        -1,
        9
    ],
    [
        "ousness",
        -1,
        10
    ], 
];
const a_6 = [
    [
        "icate",
        -1,
        4
    ],
    [
        "ative",
        -1,
        6
    ],
    [
        "alize",
        -1,
        3
    ],
    [
        "iciti",
        -1,
        4
    ],
    [
        "ical",
        -1,
        4
    ],
    [
        "tional",
        -1,
        1
    ],
    [
        "ational",
        5,
        2
    ],
    [
        "ful",
        -1,
        5
    ],
    [
        "ness",
        -1,
        5
    ], 
];
const a_7 = [
    [
        "ic",
        -1,
        1
    ],
    [
        "ance",
        -1,
        1
    ],
    [
        "ence",
        -1,
        1
    ],
    [
        "able",
        -1,
        1
    ],
    [
        "ible",
        -1,
        1
    ],
    [
        "ate",
        -1,
        1
    ],
    [
        "ive",
        -1,
        1
    ],
    [
        "ize",
        -1,
        1
    ],
    [
        "iti",
        -1,
        1
    ],
    [
        "al",
        -1,
        1
    ],
    [
        "ism",
        -1,
        1
    ],
    [
        "ion",
        -1,
        2
    ],
    [
        "er",
        -1,
        1
    ],
    [
        "ous",
        -1,
        1
    ],
    [
        "ant",
        -1,
        1
    ],
    [
        "ent",
        -1,
        1
    ],
    [
        "ment",
        15,
        1
    ],
    [
        "ement",
        16,
        1
    ], 
];
const a_8 = [
    [
        "e",
        -1,
        1
    ],
    [
        "l",
        -1,
        2
    ], 
];
const a_9 = [
    [
        "succeed",
        -1,
        -1
    ],
    [
        "proceed",
        -1,
        -1
    ],
    [
        "exceed",
        -1,
        -1
    ],
    [
        "canning",
        -1,
        -1
    ],
    [
        "inning",
        -1,
        -1
    ],
    [
        "earring",
        -1,
        -1
    ],
    [
        "herring",
        -1,
        -1
    ],
    [
        "outing",
        -1,
        -1
    ], 
];
const a_10 = [
    [
        "andes",
        -1,
        -1
    ],
    [
        "atlas",
        -1,
        -1
    ],
    [
        "bias",
        -1,
        -1
    ],
    [
        "cosmos",
        -1,
        -1
    ],
    [
        "dying",
        -1,
        3
    ],
    [
        "early",
        -1,
        9
    ],
    [
        "gently",
        -1,
        7
    ],
    [
        "howe",
        -1,
        -1
    ],
    [
        "idly",
        -1,
        6
    ],
    [
        "lying",
        -1,
        4
    ],
    [
        "news",
        -1,
        -1
    ],
    [
        "only",
        -1,
        10
    ],
    [
        "singly",
        -1,
        11
    ],
    [
        "skies",
        -1,
        2
    ],
    [
        "skis",
        -1,
        1
    ],
    [
        "sky",
        -1,
        -1
    ],
    [
        "tying",
        -1,
        5
    ],
    [
        "ugly",
        -1,
        8
    ], 
];
const g_v = [
    17,
    65,
    16,
    1
];
const g_v_WXY = [
    1,
    17,
    65,
    208,
    1
];
const g_valid_LI = [
    55,
    141,
    2
];
class EnglishStemmer extends Stemmer {
    B_Y_found = false;
    I_p2 = 0;
    I_p1 = 0;
    r_prelude() {
        this.B_Y_found = false;
        const v_1 = this.cursor;
        lab0: {
            this.bra = this.cursor;
            if (!this.eq_s("'")) {
                break lab0;
            }
            this.ket = this.cursor;
            if (!this.slice_del()) {
                return false;
            }
        }
        this.cursor = v_1;
        const v_2 = this.cursor;
        lab1: {
            this.bra = this.cursor;
            if (!this.eq_s("y")) {
                break lab1;
            }
            this.ket = this.cursor;
            if (!this.slice_from("Y")) {
                return false;
            }
            this.B_Y_found = true;
        }
        this.cursor = v_2;
        const v_3 = this.cursor;
        while(true){
            const v_4 = this.cursor;
            lab3: {
                golab4: while(true){
                    const v_5 = this.cursor;
                    lab5: {
                        if (!this.in_grouping(g_v, 97, 121)) {
                            break lab5;
                        }
                        this.bra = this.cursor;
                        if (!this.eq_s("y")) {
                            break lab5;
                        }
                        this.ket = this.cursor;
                        this.cursor = v_5;
                        break golab4;
                    }
                    this.cursor = v_5;
                    if (this.cursor >= this.limit) {
                        break lab3;
                    }
                    this.cursor++;
                }
                if (!this.slice_from("Y")) {
                    return false;
                }
                this.B_Y_found = true;
                continue;
            }
            this.cursor = v_4;
            break;
        }
        this.cursor = v_3;
        return true;
    }
    r_mark_regions() {
        this.I_p1 = this.limit;
        this.I_p2 = this.limit;
        const v_1 = this.cursor;
        lab0: {
            lab1: {
                const v_2 = this.cursor;
                lab2: {
                    if (this.find_among(a_0) == 0) {
                        break lab2;
                    }
                    break lab1;
                }
                this.cursor = v_2;
                golab3: while(true){
                    lab4: {
                        if (!this.in_grouping(g_v, 97, 121)) {
                            break lab4;
                        }
                        break golab3;
                    }
                    if (this.cursor >= this.limit) {
                        break lab0;
                    }
                    this.cursor++;
                }
                golab5: while(true){
                    lab6: {
                        if (!this.out_grouping(g_v, 97, 121)) {
                            break lab6;
                        }
                        break golab5;
                    }
                    if (this.cursor >= this.limit) {
                        break lab0;
                    }
                    this.cursor++;
                }
            }
            this.I_p1 = this.cursor;
            golab7: while(true){
                lab8: {
                    if (!this.in_grouping(g_v, 97, 121)) {
                        break lab8;
                    }
                    break golab7;
                }
                if (this.cursor >= this.limit) {
                    break lab0;
                }
                this.cursor++;
            }
            golab9: while(true){
                lab10: {
                    if (!this.out_grouping(g_v, 97, 121)) {
                        break lab10;
                    }
                    break golab9;
                }
                if (this.cursor >= this.limit) {
                    break lab0;
                }
                this.cursor++;
            }
            this.I_p2 = this.cursor;
        }
        this.cursor = v_1;
        return true;
    }
    r_shortv() {
        lab0: {
            const v_1 = this.limit - this.cursor;
            lab1: {
                if (!this.out_grouping_b(g_v_WXY, 89, 121)) {
                    break lab1;
                }
                if (!this.in_grouping_b(g_v, 97, 121)) {
                    break lab1;
                }
                if (!this.out_grouping_b(g_v, 97, 121)) {
                    break lab1;
                }
                break lab0;
            }
            this.cursor = this.limit - v_1;
            if (!this.out_grouping_b(g_v, 97, 121)) {
                return false;
            }
            if (!this.in_grouping_b(g_v, 97, 121)) {
                return false;
            }
            if (this.cursor > this.limit_backward) {
                return false;
            }
        }
        return true;
    }
    r_R1() {
        if (!(this.I_p1 <= this.cursor)) {
            return false;
        }
        return true;
    }
    r_R2() {
        if (!(this.I_p2 <= this.cursor)) {
            return false;
        }
        return true;
    }
    r_Step_1a() {
        const v_1 = this.limit - this.cursor;
        lab0: {
            this.ket = this.cursor;
            if (this.find_among_b(a_1) == 0) {
                this.cursor = this.limit - v_1;
                break lab0;
            }
            this.bra = this.cursor;
            if (!this.slice_del()) {
                return false;
            }
        }
        this.ket = this.cursor;
        const among_var = this.find_among_b(a_2);
        if (among_var == 0) {
            return false;
        }
        this.bra = this.cursor;
        switch(among_var){
            case 1:
                if (!this.slice_from("ss")) {
                    return false;
                }
                break;
            case 2:
                lab1: {
                    const v_2 = this.limit - this.cursor;
                    lab2: {
                        {
                            const c1 = this.cursor - 2;
                            if (c1 < this.limit_backward) {
                                break lab2;
                            }
                            this.cursor = c1;
                        }
                        if (!this.slice_from("i")) {
                            return false;
                        }
                        break lab1;
                    }
                    this.cursor = this.limit - v_2;
                    if (!this.slice_from("ie")) {
                        return false;
                    }
                }
                break;
            case 3:
                if (this.cursor <= this.limit_backward) {
                    return false;
                }
                this.cursor--;
                golab3: while(true){
                    lab4: {
                        if (!this.in_grouping_b(g_v, 97, 121)) {
                            break lab4;
                        }
                        break golab3;
                    }
                    if (this.cursor <= this.limit_backward) {
                        return false;
                    }
                    this.cursor--;
                }
                if (!this.slice_del()) {
                    return false;
                }
                break;
        }
        return true;
    }
    r_Step_1b() {
        this.ket = this.cursor;
        const among_var = this.find_among_b(a_4);
        if (among_var == 0) {
            return false;
        }
        this.bra = this.cursor;
        switch(among_var){
            case 1:
                if (!this.r_R1()) {
                    return false;
                }
                if (!this.slice_from("ee")) {
                    return false;
                }
                break;
            case 2:
                {
                    const v_1 = this.limit - this.cursor;
                    golab0: while(true){
                        lab1: {
                            if (!this.in_grouping_b(g_v, 97, 121)) {
                                break lab1;
                            }
                            break golab0;
                        }
                        if (this.cursor <= this.limit_backward) {
                            return false;
                        }
                        this.cursor--;
                    }
                    this.cursor = this.limit - v_1;
                    if (!this.slice_del()) {
                        return false;
                    }
                    const v_3 = this.limit - this.cursor;
                    const among_var = this.find_among_b(a_3);
                    if (among_var == 0) {
                        return false;
                    }
                    this.cursor = this.limit - v_3;
                    switch(among_var){
                        case 1:
                            {
                                const c1 = this.cursor;
                                this.insert(this.cursor, this.cursor, "e");
                                this.cursor = c1;
                            }
                            break;
                        case 2:
                            this.ket = this.cursor;
                            if (this.cursor <= this.limit_backward) {
                                return false;
                            }
                            this.cursor--;
                            this.bra = this.cursor;
                            if (!this.slice_del()) {
                                return false;
                            }
                            break;
                        case 3:
                            {
                                if (this.cursor != this.I_p1) {
                                    return false;
                                }
                                const v_4 = this.limit - this.cursor;
                                if (!this.r_shortv()) {
                                    return false;
                                }
                                this.cursor = this.limit - v_4;
                                {
                                    const c2 = this.cursor;
                                    this.insert(this.cursor, this.cursor, "e");
                                    this.cursor = c2;
                                }
                                break;
                            }
                    }
                    break;
                }
        }
        return true;
    }
    r_Step_1c() {
        this.ket = this.cursor;
        lab0: {
            const v_1 = this.limit - this.cursor;
            lab1: {
                if (!this.eq_s_b("y")) {
                    break lab1;
                }
                break lab0;
            }
            this.cursor = this.limit - v_1;
            if (!this.eq_s_b("Y")) {
                return false;
            }
        }
        this.bra = this.cursor;
        if (!this.out_grouping_b(g_v, 97, 121)) {
            return false;
        }
        lab2: {
            if (this.cursor > this.limit_backward) {
                break lab2;
            }
            return false;
        }
        if (!this.slice_from("i")) {
            return false;
        }
        return true;
    }
    r_Step_2() {
        this.ket = this.cursor;
        const among_var = this.find_among_b(a_5);
        if (among_var == 0) {
            return false;
        }
        this.bra = this.cursor;
        if (!this.r_R1()) {
            return false;
        }
        switch(among_var){
            case 1:
                if (!this.slice_from("tion")) {
                    return false;
                }
                break;
            case 2:
                if (!this.slice_from("ence")) {
                    return false;
                }
                break;
            case 3:
                if (!this.slice_from("ance")) {
                    return false;
                }
                break;
            case 4:
                if (!this.slice_from("able")) {
                    return false;
                }
                break;
            case 5:
                if (!this.slice_from("ent")) {
                    return false;
                }
                break;
            case 6:
                if (!this.slice_from("ize")) {
                    return false;
                }
                break;
            case 7:
                if (!this.slice_from("ate")) {
                    return false;
                }
                break;
            case 8:
                if (!this.slice_from("al")) {
                    return false;
                }
                break;
            case 9:
                if (!this.slice_from("ful")) {
                    return false;
                }
                break;
            case 10:
                if (!this.slice_from("ous")) {
                    return false;
                }
                break;
            case 11:
                if (!this.slice_from("ive")) {
                    return false;
                }
                break;
            case 12:
                if (!this.slice_from("ble")) {
                    return false;
                }
                break;
            case 13:
                if (!this.eq_s_b("l")) {
                    return false;
                }
                if (!this.slice_from("og")) {
                    return false;
                }
                break;
            case 14:
                if (!this.slice_from("less")) {
                    return false;
                }
                break;
            case 15:
                if (!this.in_grouping_b(g_valid_LI, 99, 116)) {
                    return false;
                }
                if (!this.slice_del()) {
                    return false;
                }
                break;
        }
        return true;
    }
    r_Step_3() {
        this.ket = this.cursor;
        const among_var = this.find_among_b(a_6);
        if (among_var == 0) {
            return false;
        }
        this.bra = this.cursor;
        if (!this.r_R1()) {
            return false;
        }
        switch(among_var){
            case 1:
                if (!this.slice_from("tion")) {
                    return false;
                }
                break;
            case 2:
                if (!this.slice_from("ate")) {
                    return false;
                }
                break;
            case 3:
                if (!this.slice_from("al")) {
                    return false;
                }
                break;
            case 4:
                if (!this.slice_from("ic")) {
                    return false;
                }
                break;
            case 5:
                if (!this.slice_del()) {
                    return false;
                }
                break;
            case 6:
                if (!this.r_R2()) {
                    return false;
                }
                if (!this.slice_del()) {
                    return false;
                }
                break;
        }
        return true;
    }
    r_Step_4() {
        this.ket = this.cursor;
        const among_var = this.find_among_b(a_7);
        if (among_var == 0) {
            return false;
        }
        this.bra = this.cursor;
        if (!this.r_R2()) {
            return false;
        }
        switch(among_var){
            case 1:
                if (!this.slice_del()) {
                    return false;
                }
                break;
            case 2:
                lab0: {
                    const v_1 = this.limit - this.cursor;
                    lab1: {
                        if (!this.eq_s_b("s")) {
                            break lab1;
                        }
                        break lab0;
                    }
                    this.cursor = this.limit - v_1;
                    if (!this.eq_s_b("t")) {
                        return false;
                    }
                }
                if (!this.slice_del()) {
                    return false;
                }
                break;
        }
        return true;
    }
    r_Step_5() {
        this.ket = this.cursor;
        const among_var = this.find_among_b(a_8);
        if (among_var == 0) {
            return false;
        }
        this.bra = this.cursor;
        switch(among_var){
            case 1:
                lab0: {
                    const v_1 = this.limit - this.cursor;
                    lab1: {
                        if (!this.r_R2()) {
                            break lab1;
                        }
                        break lab0;
                    }
                    this.cursor = this.limit - v_1;
                    if (!this.r_R1()) {
                        return false;
                    }
                    {
                        const v_2 = this.limit - this.cursor;
                        lab2: {
                            if (!this.r_shortv()) {
                                break lab2;
                            }
                            return false;
                        }
                        this.cursor = this.limit - v_2;
                    }
                }
                if (!this.slice_del()) {
                    return false;
                }
                break;
            case 2:
                if (!this.r_R2()) {
                    return false;
                }
                if (!this.eq_s_b("l")) {
                    return false;
                }
                if (!this.slice_del()) {
                    return false;
                }
                break;
        }
        return true;
    }
    r_exception2() {
        this.ket = this.cursor;
        if (this.find_among_b(a_9) == 0) {
            return false;
        }
        this.bra = this.cursor;
        if (this.cursor > this.limit_backward) {
            return false;
        }
        return true;
    }
    r_exception1() {
        this.bra = this.cursor;
        const among_var = this.find_among(a_10);
        if (among_var == 0) {
            return false;
        }
        this.ket = this.cursor;
        if (this.cursor < this.limit) {
            return false;
        }
        switch(among_var){
            case 1:
                if (!this.slice_from("ski")) {
                    return false;
                }
                break;
            case 2:
                if (!this.slice_from("sky")) {
                    return false;
                }
                break;
            case 3:
                if (!this.slice_from("die")) {
                    return false;
                }
                break;
            case 4:
                if (!this.slice_from("lie")) {
                    return false;
                }
                break;
            case 5:
                if (!this.slice_from("tie")) {
                    return false;
                }
                break;
            case 6:
                if (!this.slice_from("idl")) {
                    return false;
                }
                break;
            case 7:
                if (!this.slice_from("gentl")) {
                    return false;
                }
                break;
            case 8:
                if (!this.slice_from("ugli")) {
                    return false;
                }
                break;
            case 9:
                if (!this.slice_from("earli")) {
                    return false;
                }
                break;
            case 10:
                if (!this.slice_from("onli")) {
                    return false;
                }
                break;
            case 11:
                if (!this.slice_from("singl")) {
                    return false;
                }
                break;
        }
        return true;
    }
    r_postlude() {
        if (!this.B_Y_found) {
            return false;
        }
        while(true){
            const v_1 = this.cursor;
            lab0: {
                golab1: while(true){
                    const v_2 = this.cursor;
                    lab2: {
                        this.bra = this.cursor;
                        if (!this.eq_s("Y")) {
                            break lab2;
                        }
                        this.ket = this.cursor;
                        this.cursor = v_2;
                        break golab1;
                    }
                    this.cursor = v_2;
                    if (this.cursor >= this.limit) {
                        break lab0;
                    }
                    this.cursor++;
                }
                if (!this.slice_from("y")) {
                    return false;
                }
                continue;
            }
            this.cursor = v_1;
            break;
        }
        return true;
    }
    _stemHelper() {
        lab0: {
            const v_1 = this.cursor;
            lab1: {
                if (!this.r_exception1()) {
                    break lab1;
                }
                break lab0;
            }
            this.cursor = v_1;
            lab2: {
                {
                    const v_2 = this.cursor;
                    lab3: {
                        {
                            const c1 = this.cursor + 3;
                            if (c1 > this.limit) {
                                break lab3;
                            }
                            this.cursor = c1;
                        }
                        break lab2;
                    }
                    this.cursor = v_2;
                }
                break lab0;
            }
            this.cursor = v_1;
            this.r_prelude();
            this.r_mark_regions();
            this.limit_backward = this.cursor;
            this.cursor = this.limit;
            const v_5 = this.limit - this.cursor;
            this.r_Step_1a();
            this.cursor = this.limit - v_5;
            lab4: {
                const v_6 = this.limit - this.cursor;
                lab5: {
                    if (!this.r_exception2()) {
                        break lab5;
                    }
                    break lab4;
                }
                this.cursor = this.limit - v_6;
                const v_7 = this.limit - this.cursor;
                this.r_Step_1b();
                this.cursor = this.limit - v_7;
                const v_8 = this.limit - this.cursor;
                this.r_Step_1c();
                this.cursor = this.limit - v_8;
                const v_9 = this.limit - this.cursor;
                this.r_Step_2();
                this.cursor = this.limit - v_9;
                const v_10 = this.limit - this.cursor;
                this.r_Step_3();
                this.cursor = this.limit - v_10;
                const v_11 = this.limit - this.cursor;
                this.r_Step_4();
                this.cursor = this.limit - v_11;
                const v_12 = this.limit - this.cursor;
                this.r_Step_5();
                this.cursor = this.limit - v_12;
            }
            this.cursor = this.limit_backward;
            const v_13 = this.cursor;
            this.r_postlude();
            this.cursor = v_13;
        }
        return true;
    }
}
class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = "DenoStdInternalError";
    }
}
function assert(expr, msg = "") {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
function copy(src, dst, off = 0) {
    off = Math.max(0, Math.min(off, dst.byteLength));
    const dstBytesAvailable = dst.byteLength - off;
    if (src.byteLength > dstBytesAvailable) {
        src = src.subarray(0, dstBytesAvailable);
    }
    dst.set(src, off);
    return src.byteLength;
}
const DEFAULT_BUF_SIZE = 4096;
const MIN_BUF_SIZE = 16;
const CR = "\r".charCodeAt(0);
const LF = "\n".charCodeAt(0);
class BufferFullError extends Error {
    partial;
    name = "BufferFullError";
    constructor(partial){
        super("Buffer full");
        this.partial = partial;
    }
}
class PartialReadError extends Error {
    name = "PartialReadError";
    partial;
    constructor(){
        super("Encountered UnexpectedEof, data only partially read");
    }
}
class BufReader {
    #buf;
    #rd;
    #r = 0;
    #w = 0;
    #eof = false;
    static create(r, size = 4096) {
        return r instanceof BufReader ? r : new BufReader(r, size);
    }
    constructor(rd, size = 4096){
        if (size < 16) {
            size = MIN_BUF_SIZE;
        }
        this.#reset(new Uint8Array(size), rd);
    }
    size() {
        return this.#buf.byteLength;
    }
    buffered() {
        return this.#w - this.#r;
    }
    #fill = async ()=>{
        if (this.#r > 0) {
            this.#buf.copyWithin(0, this.#r, this.#w);
            this.#w -= this.#r;
            this.#r = 0;
        }
        if (this.#w >= this.#buf.byteLength) {
            throw Error("bufio: tried to fill full buffer");
        }
        for(let i = 100; i > 0; i--){
            const rr = await this.#rd.read(this.#buf.subarray(this.#w));
            if (rr === null) {
                this.#eof = true;
                return;
            }
            assert(rr >= 0, "negative read");
            this.#w += rr;
            if (rr > 0) {
                return;
            }
        }
        throw new Error(`No progress after ${100} read() calls`);
    };
    reset(r) {
        this.#reset(this.#buf, r);
    }
    #reset = (buf, rd)=>{
        this.#buf = buf;
        this.#rd = rd;
        this.#eof = false;
    };
    async read(p) {
        let rr = p.byteLength;
        if (p.byteLength === 0) return rr;
        if (this.#r === this.#w) {
            if (p.byteLength >= this.#buf.byteLength) {
                const rr = await this.#rd.read(p);
                const nread = rr ?? 0;
                assert(nread >= 0, "negative read");
                return rr;
            }
            this.#r = 0;
            this.#w = 0;
            rr = await this.#rd.read(this.#buf);
            if (rr === 0 || rr === null) return rr;
            assert(rr >= 0, "negative read");
            this.#w += rr;
        }
        const copied = copy(this.#buf.subarray(this.#r, this.#w), p, 0);
        this.#r += copied;
        return copied;
    }
    async readFull(p) {
        let bytesRead = 0;
        while(bytesRead < p.length){
            try {
                const rr = await this.read(p.subarray(bytesRead));
                if (rr === null) {
                    if (bytesRead === 0) {
                        return null;
                    } else {
                        throw new PartialReadError();
                    }
                }
                bytesRead += rr;
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = p.subarray(0, bytesRead);
                } else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = p.subarray(0, bytesRead);
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return p;
    }
    async readByte() {
        while(this.#r === this.#w){
            if (this.#eof) return null;
            await this.#fill();
        }
        const c = this.#buf[this.#r];
        this.#r++;
        return c;
    }
    async readString(delim) {
        if (delim.length !== 1) {
            throw new Error("Delimiter should be a single character");
        }
        const buffer = await this.readSlice(delim.charCodeAt(0));
        if (buffer === null) return null;
        return new TextDecoder().decode(buffer);
    }
    async readLine() {
        let line = null;
        try {
            line = await this.readSlice(LF);
        } catch (err) {
            if (err instanceof Deno.errors.BadResource) {
                throw err;
            }
            let partial;
            if (err instanceof PartialReadError) {
                partial = err.partial;
                assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
            }
            if (!(err instanceof BufferFullError)) {
                throw err;
            }
            partial = err.partial;
            if (!this.#eof && partial && partial.byteLength > 0 && partial[partial.byteLength - 1] === CR) {
                assert(this.#r > 0, "bufio: tried to rewind past start of buffer");
                this.#r--;
                partial = partial.subarray(0, partial.byteLength - 1);
            }
            if (partial) {
                return {
                    line: partial,
                    more: !this.#eof
                };
            }
        }
        if (line === null) {
            return null;
        }
        if (line.byteLength === 0) {
            return {
                line,
                more: false
            };
        }
        if (line[line.byteLength - 1] == LF) {
            let drop = 1;
            if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                drop = 2;
            }
            line = line.subarray(0, line.byteLength - drop);
        }
        return {
            line,
            more: false
        };
    }
    async readSlice(delim) {
        let s = 0;
        let slice;
        while(true){
            let i = this.#buf.subarray(this.#r + s, this.#w).indexOf(delim);
            if (i >= 0) {
                i += s;
                slice = this.#buf.subarray(this.#r, this.#r + i + 1);
                this.#r += i + 1;
                break;
            }
            if (this.#eof) {
                if (this.#r === this.#w) {
                    return null;
                }
                slice = this.#buf.subarray(this.#r, this.#w);
                this.#r = this.#w;
                break;
            }
            if (this.buffered() >= this.#buf.byteLength) {
                this.#r = this.#w;
                const oldbuf = this.#buf;
                const newbuf = this.#buf.slice(0);
                this.#buf = newbuf;
                throw new BufferFullError(oldbuf);
            }
            s = this.#w - this.#r;
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = slice;
                } else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = slice;
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
        }
        return slice;
    }
    async peek(n6) {
        if (n6 < 0) {
            throw Error("negative count");
        }
        let avail = this.#w - this.#r;
        while(avail < n6 && avail < this.#buf.byteLength && !this.#eof){
            try {
                await this.#fill();
            } catch (err) {
                if (err instanceof PartialReadError) {
                    err.partial = this.#buf.subarray(this.#r, this.#w);
                } else if (err instanceof Error) {
                    const e = new PartialReadError();
                    e.partial = this.#buf.subarray(this.#r, this.#w);
                    e.stack = err.stack;
                    e.message = err.message;
                    e.cause = err.cause;
                    throw err;
                }
                throw err;
            }
            avail = this.#w - this.#r;
        }
        if (avail === 0 && this.#eof) {
            return null;
        } else if (avail < n6 && this.#eof) {
            return this.#buf.subarray(this.#r, this.#r + avail);
        } else if (avail < n6) {
            throw new BufferFullError(this.#buf.subarray(this.#r, this.#w));
        }
        return this.#buf.subarray(this.#r, this.#r + n6);
    }
}
class AbstractBufBase {
    buf;
    usedBufferBytes = 0;
    err = null;
    constructor(buf){
        this.buf = buf;
    }
    size() {
        return this.buf.byteLength;
    }
    available() {
        return this.buf.byteLength - this.usedBufferBytes;
    }
    buffered() {
        return this.usedBufferBytes;
    }
}
class BufWriter extends AbstractBufBase {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
    }
    constructor(writer, size = 4096){
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        const buf = new Uint8Array(size);
        super(buf);
        this.#writer = writer;
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w;
    }
    async flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p.length){
                nwritten += await this.#writer.write(p.subarray(nwritten));
            }
        } catch (e) {
            if (e instanceof Error) {
                this.err = e;
            }
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    async write(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = await this.#writer.write(data);
                } catch (e) {
                    if (e instanceof Error) {
                        this.err = e;
                    }
                    throw e;
                }
            } else {
                numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                await this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
class BufWriterSync extends AbstractBufBase {
    #writer;
    static create(writer, size = 4096) {
        return writer instanceof BufWriterSync ? writer : new BufWriterSync(writer, size);
    }
    constructor(writer, size = 4096){
        if (size <= 0) {
            size = DEFAULT_BUF_SIZE;
        }
        const buf = new Uint8Array(size);
        super(buf);
        this.#writer = writer;
    }
    reset(w) {
        this.err = null;
        this.usedBufferBytes = 0;
        this.#writer = w;
    }
    flush() {
        if (this.err !== null) throw this.err;
        if (this.usedBufferBytes === 0) return;
        try {
            const p = this.buf.subarray(0, this.usedBufferBytes);
            let nwritten = 0;
            while(nwritten < p.length){
                nwritten += this.#writer.writeSync(p.subarray(nwritten));
            }
        } catch (e) {
            if (e instanceof Error) {
                this.err = e;
            }
            throw e;
        }
        this.buf = new Uint8Array(this.buf.length);
        this.usedBufferBytes = 0;
    }
    writeSync(data) {
        if (this.err !== null) throw this.err;
        if (data.length === 0) return 0;
        let totalBytesWritten = 0;
        let numBytesWritten = 0;
        while(data.byteLength > this.available()){
            if (this.buffered() === 0) {
                try {
                    numBytesWritten = this.#writer.writeSync(data);
                } catch (e) {
                    if (e instanceof Error) {
                        this.err = e;
                    }
                    throw e;
                }
            } else {
                numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
                this.usedBufferBytes += numBytesWritten;
                this.flush();
            }
            totalBytesWritten += numBytesWritten;
            data = data.subarray(numBytesWritten);
        }
        numBytesWritten = copy(data, this.buf, this.usedBufferBytes);
        this.usedBufferBytes += numBytesWritten;
        totalBytesWritten += numBytesWritten;
        return totalBytesWritten;
    }
}
" ".charCodeAt(0);
"\t".charCodeAt(0);
":".charCodeAt(0);
new TextDecoder();
const { hasOwn  } = Object;
const C1 = 3432918353;
const C2 = 461845907;
const R1 = 15;
const R2 = 13;
const M = 5;
const N = 3864292196;
const textEncoder = new TextEncoder();
const rotateLeft = (m, n)=>{
    return m << n | m >>> 32 - n;
};
const murmurHash3 = (key, { seed  } = {
    seed: 0
})=>{
    const bytes = textEncoder.encode(key);
    let hash = seed >>> 0;
    const remainingBytes = bytes.length % 4;
    const fourByteChunks = bytes.length - remainingBytes;
    let i = 0;
    for(; i < fourByteChunks; i += 4){
        let k = (bytes[i] & 255) + ((bytes[i + 1] & 255) << 8) + ((bytes[i + 2] & 255) << 16) + ((bytes[i + 3] & 255) << 24);
        k = Math.imul(k, C1);
        k = rotateLeft(k, R1);
        k = Math.imul(k, C2);
        hash ^= k;
        hash = rotateLeft(hash, R2);
        hash = Math.imul(hash, M) + N;
    }
    let k = 0;
    switch(remainingBytes){
        case 3:
            k |= (bytes[i + 2] & 255) << 16;
        case 2:
            k |= (bytes[i + 1] & 255) << 8;
        case 1:
            k |= bytes[i] & 255;
            k = Math.imul(k, C1);
            k = rotateLeft(k, R1);
            k = Math.imul(k, C2);
            hash ^= k;
    }
    hash ^= bytes.length;
    hash ^= hash >>> 16;
    hash = Math.imul(hash, 2246822507);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 3266489909);
    hash ^= hash >>> 16;
    return hash >>> 0;
};
const APOSTROPHES = /[\u{2018}\u{2019}\u{201B}]/gu;
const ENDING_FINAL_STOP = /\.([\p{White_Space}\p{Open_Punctuation}\p{Close_Punctuation}\p{Quotation_Mark}]*)$/u;
const preprocess = (text)=>{
    return text.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "").replace(APOSTROPHES, "'").replace(/\.{2,}/g, " ... ").replace(ENDING_FINAL_STOP, " .$1").replace(/[_\s]+/g, " ");
};
const segmenter = new Intl.Segmenter("en", {
    granularity: "word"
});
const tokenize = (sentence)=>{
    let space = true;
    const tokens = [];
    for (const { segment  } of segmenter.segment(sentence)){
        switch(segment){
            case " ":
                space = true;
                break;
            case ".":
                if (space) {
                    tokens.push(".");
                } else {
                    tokens[tokens.length - 1] += ".";
                }
                space = false;
                break;
            default:
                tokens.push(segment);
                space = false;
        }
    }
    return tokens;
};
const BASE_STOP_WORDS = [
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "by",
    "can't",
    "cannot",
    "could",
    "couldn't",
    "did",
    "didn't",
    "do",
    "does",
    "doesn't",
    "doing",
    "don't",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "hadn't",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "he'd",
    "he'll",
    "he's",
    "her",
    "here",
    "here's",
    "hers",
    "herself",
    "him",
    "himself",
    "his",
    "how",
    "how's",
    "i",
    "i'd",
    "i'll",
    "i'm",
    "i've",
    "if",
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "it's",
    "its",
    "itself",
    "let's",
    "me",
    "more",
    "most",
    "mustn't",
    "my",
    "myself",
    "no",
    "nor",
    "not",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "ought",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "shan't",
    "she",
    "she'd",
    "she'll",
    "she's",
    "should",
    "shouldn't",
    "so",
    "some",
    "such",
    "than",
    "that",
    "that's",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "there's",
    "these",
    "they",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this",
    "those",
    "through",
    "to",
    "too",
    "under",
    "until",
    "up",
    "very",
    "was",
    "wasn't",
    "we",
    "we'd",
    "we'll",
    "we're",
    "we've",
    "were",
    "weren't",
    "what",
    "what's",
    "when",
    "when's",
    "where",
    "where's",
    "which",
    "while",
    "who",
    "who's",
    "whom",
    "why",
    "why's",
    "with",
    "won't",
    "would",
    "wouldn't",
    "you",
    "you'd",
    "you'll",
    "you're",
    "you've",
    "your",
    "yours",
    "yourself",
    "yourselves", 
];
const STOP_WORDS = Object.freeze(Object.fromEntries(BASE_STOP_WORDS.flatMap((stopWord)=>tokenize(stopWord)
).map((tokenizedStopWord)=>[
        tokenizedStopWord
    ]
)));
const stemmer = new EnglishStemmer();
const segmenter1 = new Intl.Segmenter("en", {
    granularity: "sentence"
});
const vectorize = (text)=>{
    return [
        ...segmenter1.segment(text)
    ].map(({ segment  })=>{
        const vector = new Set();
        for (const word of tokenize(preprocess(segment))){
            if (word in STOP_WORDS) {
                continue;
            }
            const base = stemmer.stem(word);
            const index = murmurHash3(base) % N_FEATURES;
            vector.add(index);
        }
        return vector;
    }).filter((vector)=>vector.size
    );
};
const loss = (p, y)=>{
    const z = p * y;
    if (z > 18) {
        return Math.exp(-z);
    } else if (z < -18) {
        return -z;
    } else {
        return Math.log(1 + Math.exp(-z));
    }
};
const dLoss = (p, y)=>{
    const z = p * y;
    if (z > 18) {
        return Math.exp(-z) * -y;
    } else if (z < -18) {
        return -y;
    } else {
        return -y / (1 + Math.exp(z));
    }
};
const l2Norm = (n)=>{
    return n ** 0.5 / n;
};
const alternateSign = (i)=>{
    return 2 * (i & 1) - 1;
};
const partialFit = (samples, weights)=>{
    let beta = 0;
    const u = weights.slice();
    const uHat = weights.slice();
    let sumLoss = 0;
    for (const { x , y , weight: weight1  } of samples){
        let p = 0;
        x.forEach((i)=>{
            p += u[i] * alternateSign(i);
        });
        p *= l2Norm(x.size);
        sumLoss += loss(p, y);
        beta++;
        const g = dLoss(p, y);
        const constant = g * weight1;
        x.forEach((i)=>{
            const sign = alternateSign(i);
            u[i] -= constant * sign;
            uHat[i] += constant * beta * sign;
        });
    }
    const averageLoss = (sumLoss / samples.length).toFixed(4);
    console.info(`Partial fit - Average loss: ${averageLoss}`);
    return u.map((weight, i)=>(weight + uHat[i]) / beta
    );
};
function predict(x, weights) {
    if (typeof x === "number") {
        return x > 0 ? 1 : -1;
    } else if (x instanceof Set && weights) {
        return probability(x, weights) > 0 ? 1 : -1;
    } else {
        throw new RangeError(`Invalid types for predict: ${x}, ${weights}`);
    }
}
const probability = (x, weights)=>{
    let prob = 0;
    x.forEach((i)=>{
        prob += weights[i] * alternateSign(i);
    });
    return Math.max(-1, Math.min(1, l2Norm(x.size) * prob));
};
const T_DISTRIBUTION_TABLE = [
    {
        i: 0,
        0.2: 10,
        0.05: 10
    },
    {
        i: 1,
        0.2: 3.078,
        0.05: 12.71
    },
    {
        i: 2,
        0.2: 1.886,
        0.05: 4.303
    },
    {
        i: 3,
        0.2: 1.638,
        0.05: 3.182
    },
    {
        i: 4,
        0.2: 1.533,
        0.05: 2.776
    },
    {
        i: 5,
        0.2: 1.476,
        0.05: 2.571
    },
    {
        i: 6,
        0.2: 1.44,
        0.05: 2.447
    },
    {
        i: 7,
        0.2: 1.415,
        0.05: 2.365
    },
    {
        i: 8,
        0.2: 1.397,
        0.05: 2.306
    },
    {
        i: 9,
        0.2: 1.383,
        0.05: 2.262
    },
    {
        i: 10,
        0.2: 1.372,
        0.05: 2.228
    },
    {
        i: 11,
        0.2: 1.363,
        0.05: 2.201
    },
    {
        i: 12,
        0.2: 1.356,
        0.05: 2.179
    },
    {
        i: 13,
        0.2: 1.35,
        0.05: 2.16
    },
    {
        i: 14,
        0.2: 1.345,
        0.05: 2.145
    },
    {
        i: 15,
        0.2: 1.341,
        0.05: 2.131
    },
    {
        i: 16,
        0.2: 1.337,
        0.05: 2.12
    },
    {
        i: 17,
        0.2: 1.333,
        0.05: 2.11
    },
    {
        i: 18,
        0.2: 1.33,
        0.05: 2.101
    },
    {
        i: 19,
        0.2: 1.328,
        0.05: 2.093
    },
    {
        i: 20,
        0.2: 1.325,
        0.05: 2.086
    },
    {
        i: 21,
        0.2: 1.323,
        0.05: 2.08
    },
    {
        i: 22,
        0.2: 1.321,
        0.05: 2.074
    },
    {
        i: 23,
        0.2: 1.319,
        0.05: 2.069
    },
    {
        i: 24,
        0.2: 1.318,
        0.05: 2.064
    },
    {
        i: 25,
        0.2: 1.316,
        0.05: 2.06
    },
    {
        i: 26,
        0.2: 1.315,
        0.05: 2.056
    },
    {
        i: 27,
        0.2: 1.314,
        0.05: 2.052
    },
    {
        i: 28,
        0.2: 1.313,
        0.05: 2.048
    },
    {
        i: 29,
        0.2: 1.311,
        0.05: 2.045
    },
    {
        i: 30,
        0.2: 1.31,
        0.05: 2.042
    },
    {
        i: 40,
        0.2: 1.303,
        0.05: 2.021
    },
    {
        i: 60,
        0.2: 1.296,
        0.05: 2
    },
    {
        i: 80,
        0.2: 1.292,
        0.05: 1.99
    },
    {
        i: 100,
        0.2: 1.29,
        0.05: 1.984
    },
    {
        i: 1000,
        0.2: 1.282,
        0.05: 1.962
    }, 
];
const tLookup = (degreesOfFreedom)=>{
    let l = 0;
    let r = T_DISTRIBUTION_TABLE.length - 1;
    while(l < r){
        const m = Math.floor((l + r) / 2);
        const index = T_DISTRIBUTION_TABLE[m].i;
        if (index < degreesOfFreedom) {
            l = m + 1;
        } else {
            r = m;
        }
    }
    return T_DISTRIBUTION_TABLE[l];
};
const mean = (samples)=>{
    return samples.reduce((a, b)=>a + b
    ) / samples.length;
};
const std = (samples)=>{
    if (samples.length < 2) {
        return 1;
    }
    const sampleMean = mean(samples);
    const sumSquaredError = samples.reduce((sum, sample)=>{
        const error = sample - sampleMean;
        const squaredError = error * error;
        return sum + squaredError;
    }, 0);
    const variance = sumSquaredError / (samples.length - 1);
    return variance ** 0.5;
};
const marginOfError = (samples, alpha)=>{
    const degreesOfFreedom = samples.length - 1;
    const tStatistic = tLookup(degreesOfFreedom)[alpha];
    const standardError = std(samples) / samples.length ** 0.5;
    const marginOfError1 = tStatistic * standardError;
    return marginOfError1;
};
const POLITICAL_COMPASS_ATTRIBUTES = {
    tabindex: "0",
    tagName: "svg",
    idPrefix: "political-compass",
    titleText: "Political Compass",
    descText: "Visual that places samples of text on the political compass",
    viewBox: "-10 -10 20 20",
    role: "img"
};
const Q2_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #fa7576",
    width: "10",
    height: "10",
    x: "-10",
    y: "-10"
};
const Q1_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #a0d5ff",
    width: "10",
    height: "10",
    x: "0",
    y: "-10"
};
const Q3_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #cdf6ca",
    width: "10",
    height: "10",
    x: "-10",
    y: "0"
};
const Q4_ATTRIBUTES = {
    tagName: "rect",
    style: "fill: #e0cdf5",
    width: "10",
    height: "10",
    x: "0",
    y: "0"
};
const CONFIDENCE_REGION_95_ATTRIBUTES = {
    role: "presentation",
    tabindex: "0",
    tagName: "ellipse",
    idPrefix: "confidence-region-95",
    titleText: "95% Confidence Interval",
    descText: "",
    style: "fill: lightGray; opacity: 60%; outline: none",
    visibility: "hidden"
};
const CONFIDENCE_REGION_80_ATTRIBUTES = {
    role: "presentation",
    tabindex: "0",
    tagName: "ellipse",
    idPrefix: "confidence-region-80",
    titleText: "80% Confidence Interval",
    descText: "",
    style: "fill: gray; opacity: 60%; outline: none",
    visibility: "hidden"
};
const PREDICTION_MEAN_ATTRIBUTES = {
    role: "presentation",
    tabindex: "0",
    tagName: "circle",
    idPrefix: "prediction-mean",
    titleText: "Prediction Mean",
    descText: "",
    fill: "black",
    r: "1",
    visibility: "hidden",
    style: "outline: none"
};
const SCREEN_READER_ONLY_STYLE = "position: absolute; height: 1px; width: 1px; overflow: hidden; clip: rect(1px, 1px, 1px, 1px)";
const svgElementFactory = ({ tagName , ...attributes })=>{
    const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    for (const attribute of Object.entries(attributes)){
        element.setAttribute(...attribute);
    }
    return element;
};
const accessibleSvgElementFactory = ({ idPrefix , titleText , descText , ...attributes })=>{
    const titleElement = document.createElement("title");
    titleElement.innerText = titleText;
    titleElement.id = `${idPrefix}-title`;
    const descElement = document.createElement("desc");
    descElement.innerText = descText;
    descElement.id = `${idPrefix}-desc`;
    const element = svgElementFactory(attributes);
    const labelledBy = `${titleElement.id} ${descElement.id}`;
    element.setAttribute("aria-labelledby", labelledBy);
    element.prepend(titleElement, descElement);
    return element;
};
const roundThirds = (x)=>{
    return Math.max(-10, Math.min(10, 10 * Math.round(3 * x / 20)));
};
class PoliticalCompass extends HTMLElement {
    societyWeights;
    economyWeights;
    #politicalCompass;
    #predictionMean;
    #confidenceRegion80;
    #confidenceRegion95;
    #isBeingMovedByMouse = false;
    #sampleFeatureVectors;
    #societyPredictions;
    #economyPredictions;
    #previousSocietyWeights;
    #previousEconomyWeights;
    #previousTextsHash;
    #screenReaderOnly;
    constructor(){
        super();
        [this.#politicalCompass, this.#confidenceRegion95, this.#confidenceRegion80, this.#predictionMean, ] = this.#renderPoliticalCompass();
        this.#screenReaderOnly = document.createElement("tspan");
        this.#screenReaderOnly.setAttribute("style", SCREEN_READER_ONLY_STYLE);
        this.#screenReaderOnly.setAttribute("aria-live", "polite");
        this.attachShadow({
            mode: "open"
        }).append(this.#politicalCompass, this.#screenReaderOnly);
    }
     #renderPoliticalCompass() {
        const politicalCompass = accessibleSvgElementFactory(POLITICAL_COMPASS_ATTRIBUTES);
        politicalCompass.appendChild(svgElementFactory(Q1_ATTRIBUTES));
        politicalCompass.appendChild(svgElementFactory(Q2_ATTRIBUTES));
        politicalCompass.appendChild(svgElementFactory(Q3_ATTRIBUTES));
        politicalCompass.appendChild(svgElementFactory(Q4_ATTRIBUTES));
        const [confidenceRegion95, confidenceRegion80, ] = this.#renderConfidenceRegions(politicalCompass);
        const predictionMean = this.#renderPredictionMean(politicalCompass);
        return [
            politicalCompass,
            confidenceRegion95,
            confidenceRegion80,
            predictionMean, 
        ];
    }
     #renderConfidenceRegions(politicalCompass) {
        const confidenceRegion95 = accessibleSvgElementFactory(CONFIDENCE_REGION_95_ATTRIBUTES);
        politicalCompass.appendChild(confidenceRegion95);
        const confidenceRegion80 = accessibleSvgElementFactory(CONFIDENCE_REGION_80_ATTRIBUTES);
        politicalCompass.appendChild(confidenceRegion80);
        return [
            confidenceRegion95,
            confidenceRegion80
        ];
    }
     #renderPredictionMean(politicalCompass1) {
        const predictionMean = accessibleSvgElementFactory(PREDICTION_MEAN_ATTRIBUTES);
        politicalCompass1.appendChild(predictionMean);
        predictionMean.addEventListener("pointerdown", this.#onPointerDown);
        document.addEventListener("pointermove", this.#onPointerMove);
        document.addEventListener("pointerup", this.#onPointerUp);
        politicalCompass1.addEventListener("keydown", this.#onKeyDown);
        return predictionMean;
    }
    computeConfidenceRegion(document) {
        if (!this.societyWeights || !this.economyWeights) {
            console.warn("One or both of the weights has not been set");
            return;
        }
        this.#sampleFeatureVectors = vectorize(document);
        if (this.#sampleFeatureVectors.length < 2) {
            console.warn("Cannot compute confidence with texts.length of 0");
            this.#confidenceRegion95.setAttribute("visibility", "hidden");
            this.#confidenceRegion80.setAttribute("visibility", "hidden");
            this.#predictionMean.setAttribute("visibility", "hidden");
            return;
        }
        const societyProbabilities = this.#sampleFeatureVectors.map((x)=>{
            return probability(x, this.societyWeights);
        });
        const economyProbabilities = this.#sampleFeatureVectors.map((x)=>{
            return probability(x, this.economyWeights);
        });
        const currentTextsHash = this.#computeCurrentTextsHash();
        if (currentTextsHash !== this.#previousTextsHash) {
            this.#previousSocietyWeights = this.societyWeights;
            this.#previousEconomyWeights = this.economyWeights;
            this.#societyPredictions = societyProbabilities.map((yHat)=>{
                return predict(yHat);
            });
            this.#economyPredictions = economyProbabilities.map((yHat)=>{
                return predict(yHat);
            });
            this.#previousTextsHash = currentTextsHash;
        }
        const societyMean = Math.min(10, Math.max(-10, 10 * mean(societyProbabilities)));
        const societyMoe80 = Math.max(1.5, 10 * marginOfError(societyProbabilities, 0.2));
        const societyMoe95 = Math.max(2, 10 * marginOfError(societyProbabilities, 0.05));
        const economyMean = Math.min(10, Math.max(-10, 10 * mean(economyProbabilities)));
        const economyMoe80 = Math.max(1.5, 10 * marginOfError(economyProbabilities, 0.2));
        const economyMoe95 = Math.max(2, 10 * marginOfError(economyProbabilities, 0.05));
        this.#renderConfidenceRegion({
            confidenceRegion: this.#confidenceRegion80,
            interval: "80%",
            societyMean,
            economyMean,
            societyMoe: societyMoe80,
            economyMoe: economyMoe80
        });
        this.#renderConfidenceRegion({
            confidenceRegion: this.#confidenceRegion95,
            interval: "95%",
            societyMean,
            economyMean,
            societyMoe: societyMoe95,
            economyMoe: economyMoe95
        });
        this.#setPredictionMean({
            societyMean,
            economyMean
        });
    }
     #computeCurrentTextsHash() {
        let textsHash = 0;
        this.#sampleFeatureVectors.forEach((x)=>{
            x.forEach((i)=>{
                textsHash += i;
            });
        });
        return textsHash;
    }
     #renderConfidenceRegion({ confidenceRegion , interval , societyMean , economyMean , societyMoe , economyMoe  }) {
        const societyLowerBound = Math.round(societyMean - societyMoe);
        const societyUpperBound = Math.round(societyMean + societyMoe);
        const economyLowerBound = Math.round(economyMean - economyMoe);
        const economyUpperBound = Math.round(economyMean + economyMoe);
        const desc = confidenceRegion.children[1];
        desc.innerText = `Society axis ${interval} confidence interval between ${societyLowerBound} and ${societyUpperBound};\
      economy axis ${interval} confidence interval  between ${economyLowerBound} and ${economyUpperBound}`;
        confidenceRegion.setAttribute("cx", societyMean + "");
        confidenceRegion.setAttribute("cy", -economyMean + "");
        confidenceRegion.setAttribute("rx", societyMoe + "");
        confidenceRegion.setAttribute("ry", economyMoe + "");
        confidenceRegion.setAttribute("visibility", "visible");
    }
     #setPredictionMean({ societyMean: societyMean1 , economyMean: economyMean1  }) {
        const desc = this.#predictionMean.children[1];
        const societyMeanPrediction = Math.round(societyMean1);
        const economyMeanPrediction = Math.round(economyMean1);
        this.#screenReaderOnly.innerText = "Political compass visual updated";
        desc.innerText = `Society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${economyMeanPrediction};\
      use W A S D, arrow keys, or drag to adjust this prediction`;
        this.#predictionMean.setAttribute("cx", societyMean1 + "");
        this.#predictionMean.setAttribute("cy", -economyMean1 + "");
        this.#predictionMean.setAttribute("visibility", "visible");
    }
    computeSvgPoint(event) {
        if (event) {
            const domPoint = this.#politicalCompass.createSVGPoint();
            domPoint.x = event.clientX;
            domPoint.y = event.clientY;
            const domMatrix = this.#politicalCompass.getScreenCTM().inverse();
            const svgPoint = domPoint.matrixTransform(domMatrix);
            return svgPoint;
        } else {
            const svgPoint = this.#politicalCompass.createSVGPoint();
            svgPoint.x = +this.#predictionMean.getAttribute("cx");
            svgPoint.y = +this.#predictionMean.getAttribute("cy");
            return svgPoint;
        }
    }
    #onPointerDown = ()=>{
        this.#isBeingMovedByMouse = true;
    };
    #onPointerMove = (event)=>{
        if (!this.#isBeingMovedByMouse) {
            return;
        }
        const { x , y  } = this.computeSvgPoint(event);
        this.#predictionMean.setAttribute("cx", x + "");
        this.#predictionMean.setAttribute("cy", y + "");
        const desc = this.#predictionMean.children[1];
        const societyMeanPrediction = roundThirds(x);
        const economyMeanPrediction = roundThirds(y);
        desc.innerText = this.#screenReaderOnly.innerText = `Selecting society mean prediction of ${societyMeanPrediction};\
      economy axis mean prediction of ${-economyMeanPrediction};\
      release pointer to select this adjustment`;
        this.#moveConfidenceRegionsToThirds(x, y);
    };
    #onPointerUp = (event)=>{
        const isBeingMovedByKeyBoard = !event;
        if (!this.#isBeingMovedByMouse && !isBeingMovedByKeyBoard) {
            return;
        }
        this.#isBeingMovedByMouse = false;
        console.debug("Placing new prediction mean");
        const { x: x1 , y: y1  } = this.computeSvgPoint(event);
        this.#movePredictionMeanToThirds(x1, y1);
        this.#moveConfidenceRegionsToThirds(x1, y1);
        const desc = this.#predictionMean.children[1];
        const societyMeanPrediction = roundThirds(x1);
        const economyMeanPrediction = roundThirds(y1);
        desc.innerText = this.#screenReaderOnly.innerText = `Adjusted society mean prediction to ${societyMeanPrediction};\
      economy axis mean prediction to ${-economyMeanPrediction};\
      use W A S D, arrow keys, or drag to adjust this prediction`;
        const societyYTrue = -roundThirds(x1) / 10;
        const societySamples = this.#sampleFeatureVectors.map((x, i)=>{
            const societyYHat = this.#societyPredictions[i];
            const y = societyYTrue === 0 ? -societyYHat : societyYTrue;
            return {
                x,
                y,
                weight: 1
            };
        });
        this.societyWeights = partialFit(societySamples, this.#previousSocietyWeights);
        const economyYTrue = roundThirds(y1) / 10;
        const economySamples = this.#sampleFeatureVectors.map((x, i)=>{
            const economyYHat = this.#economyPredictions[i];
            const y = economyYTrue === 0 ? -economyYHat : economyYTrue;
            return {
                x,
                y,
                weight: 1
            };
        });
        this.economyWeights = partialFit(economySamples, this.#previousEconomyWeights);
        console.debug("Sending weightsupdate event");
        const weightsUpdateEvent = new CustomEvent("weightsupdate", {
            detail: {
                societyWeights: this.societyWeights,
                economyWeights: this.economyWeights
            }
        });
        this.dispatchEvent(weightsUpdateEvent);
    };
    #onKeyDown = (keyboardEvent)=>{
        let cx = +this.#predictionMean.getAttribute("cx");
        let cy = +this.#predictionMean.getAttribute("cy");
        switch(keyboardEvent.key){
            case "Up":
            case "ArrowUp":
            case "W":
            case "w":
                cy -= 10;
                break;
            case "Left":
            case "ArrowLeft":
            case "A":
            case "a":
                cx -= 10;
                break;
            case "Down":
            case "ArrowDown":
            case "S":
            case "s":
                cy += 10;
                break;
            case "Right":
            case "ArrowRight":
            case "D":
            case "d":
                cx += 10;
                break;
            default:
                return;
        }
        this.#predictionMean.setAttribute("cx", cx + "");
        this.#predictionMean.setAttribute("cy", cy + "");
        this.#onPointerUp();
    };
    #movePredictionMeanToThirds = (x, y)=>{
        const societyMeanPrediction = roundThirds(x);
        const economyMeanPrediction = roundThirds(y);
        this.#predictionMean.setAttribute("cx", societyMeanPrediction + "");
        this.#predictionMean.setAttribute("cy", economyMeanPrediction + "");
        this.#confidenceRegion80.children[1].innerText = "80% confidence region";
        this.#confidenceRegion95.children[1].innerText = "95% confidence region";
    };
    #moveConfidenceRegionsToThirds = (x, y)=>{
        const cx = roundThirds(x) + "";
        const cy = roundThirds(y) + "";
        this.#confidenceRegion80.setAttribute("cx", cx);
        this.#confidenceRegion80.setAttribute("cy", cy);
        this.#confidenceRegion95.setAttribute("cx", cx);
        this.#confidenceRegion95.setAttribute("cy", cy);
    };
}
customElements.define("political-compass", PoliticalCompass);
