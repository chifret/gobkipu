"use strict";

export class LoginService {

    login(token: { id: number, clan: string, meute: string }): void {
        localStorage.setItem('token', JSON.stringify(token));
    }

    getToken(): { id: number, clan: string, meute: string } {
        if (localStorage.getItem('token')) {
            return JSON.parse(localStorage.getItem('token'));
        } else {
            return null;
        }
    }

    isConnected(): boolean {
        if (localStorage.getItem('token')) {
            const token: { id: number, clan: string, meute: string } = JSON.parse(localStorage.getItem('token'));
            if (token.id && (token.clan || token.meute)) {
                return true
            }
        }
        return false;
    }

    logout(): void {
        localStorage.setItem('token', null);
    }

}
