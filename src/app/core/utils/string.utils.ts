"use strict";

export class StringUtils {

    static pragmaticRemoveAccents(str: string): string {
        //https://gist.github.com/msaby/1201480
        const diacFr: any = [
            ["a", /[\u00AA\u00E0\u00E1\u00E2\u00E3\u00E4\u00E5]/g],
            ["e", /[\u00E8\u00E9\u00EA\u00EB]/g],
            ["i", /[\u00EC\u00ED\u00EE\u00EF]/g],
            ["o", /[\u00BA\u00F2\u00F3\u00F4\u00F5\u00F6\u00F8]/g],
            ["u", /[\u00F9\u00FA\u00FB\u00FC\u1EE7]/g],
            ["c", /[\u00E7]/g]
        ];

        for (let i = 0; i < diacFr.length; i++) {
            str = str.replace(diacFr[i][1], diacFr[i][0]);
        }

        return str;
    }

    static getSrcFromString(str: string): string[] {
        const ret: string[] = new Array();
        let m: RegExpExecArray;
        const regex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;
        while (m === regex.exec(str)) {
            ret.push(m[1]);
        }
        return ret;
    }

    static smartNameShortener(str: any, args: any): any {
        if (!isNaN(str)) {
            return str;
        }

        const maxLength = args && (args as { maxLength?: number, maxWordLength?: number, lowercase?: boolean }).maxLength || 30;
        const lowercase = args && (args as { maxLength?: number, maxWordLength?: number, lowercase?: boolean }).lowercase || true;
        if (str.length <= maxLength) {
            // ReSharper disable once HeuristicallyUnreachableCode
            // ReSharper disable once ConditionIsAlwaysConst
            return lowercase ? str.toLowerCase() : str;
        }

        const maxWordLength = args && (args as { maxLength?: number, maxWordLength?: number, lowercase?: boolean }).maxWordLength || 6;

        // ReSharper disable once HeuristicallyUnreachableCode
        // ReSharper disable once ConditionIsAlwaysConst
        const splitWords = (lowercase ? str.toLowerCase() : str).split(" ");
        for (let i = 0; i < splitWords.length; i++) {
            splitWords[i] = splitWords[i].substring(0, maxWordLength);
        }
        str = splitWords.join(" ");

        return str.substring(0, maxLength);
    }
}
