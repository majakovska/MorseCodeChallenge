import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IJWTTokenData } from 'src/app/models/jwt-token-data';
import { AuthService } from 'src/app/services/auth.service';
import { morseCode } from 'src/app/schemas/morse-code';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  username: string;
  password: string;
  userSub: Subscription | undefined;
  resultSub: Subscription | undefined;
  expirationDate: string | undefined;
  concatenatedResult: string | undefined;
  vegaItOmega: string;
  firstName: string;
  lastName: string;
  email: string;
  githubUrl: string;


  constructor(private authService: AuthService, private router: Router) {
    this.username = "omega";
    this.password = "candidate";
    this.vegaItOmega = "Vega IT Omega";
    this.firstName = "Maja";
    this.lastName = "Gavrilovic";
    this.email = "majamaj@live.com";
    this.githubUrl = "https://github.com/majakovska";

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    if (this.resultSub) {
      this.resultSub.unsubscribe();
    }

    if (this.userSub) {
      this.userSub.unsubscribe();
    }

  }

  public onAuthentication(): void {

    const obsUser: Observable<string> = this.authService.authenticateUser(
      this.username, this.password
    );

    const sub: Subscription = obsUser.subscribe((token: string) => {
      console.log(token);
      this.getExpirationDateFromToken(token);
      this.concatenatedResult = this.vegaItOmega + " : " + this.expirationDate;
      console.log(this.concatenatedResult);
      let result = this.translateToMorseCode(this.concatenatedResult.toLowerCase());
      console.log(result);
      this.onPostResult(result);

    }, (err) => {
      if (err.error) {
        console.log(err.error.message);
      }
    });
    this.userSub = sub;

  }

  public getExpirationDateFromToken(token: string): void {

    const payloadString: string = token.split('.')[1];
    console.log("payload: " + payloadString);
    const userDataJSON: string = atob(payloadString);
    const payload: IJWTTokenData = JSON.parse(userDataJSON);
    this.expirationDate = payload.exp;

  }

  public translateCharToMorseCode(letterOrNumber: string): string {

    const index = Object.entries(morseCode).findIndex(x => x[0] == letterOrNumber);
    return Object.entries(morseCode)[index][1];

  }

  public translateToMorseCode(concatenatedResult: string): string {

    let result = "";
    for (let j = 0; j < concatenatedResult.length; j++) {
      if (concatenatedResult[j] == ' ') {
        result += " / ";
        continue;
      }
      result += this.translateCharToMorseCode(concatenatedResult[j].toLowerCase());
      result += " ";
    }
    return result;

  }

  public onPostResult(result: string): void {

    const obsResult: Observable<{ message: string }> = this.authService.postResult(
      this.firstName, this.lastName, this.email, result, this.githubUrl);

    const sub: Subscription = obsResult.subscribe((message) => {
      console.log(message);
    }, (err) => {
      if (err.error) {
        console.log(err.error.message);
      }
    });
    this.resultSub = sub;

  }
}
