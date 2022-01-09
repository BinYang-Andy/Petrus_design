import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable,of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError} from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient,
              private processHTTPMsgService:ProcessHTTPMsgService) { }

  getLeaders():Observable<Leader[]>{
    // return Promise.resolve(LEADERS);
    // return of (LEADERS).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leaders')
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeader(id:string):Observable<Leader>{
    // return Promise.resolve(LEADERS.filter((leader)=>(leader.id ===id))[0]);
    // return of (LEADERS.filter((leader)=>(leader.id ===id))[0]).pipe(delay(2000));
    return this.http.get<Leader>(baseURL + 'leaders/'+ id)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedLeader():Observable<Leader>{
    // return Promise.resolve(LEADERS.filter((leader)=> leader.featured)[0]);
    // return of (LEADERS.filter((leader)=> leader.featured)[0]).pipe(delay(2000));
    return this.http.get<Leader[]>(baseURL + 'leaders?featured=true')
      .pipe(map(leaders => leaders[0]))
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getLeaderIds(): Observable<string[] | any>{
    return this.getLeaders().pipe(map(leaders => leaders.map(leader=>leader.id)))
    .pipe(catchError(error =>error));

  }

  putLeader(leader: Leader): Observable<Leader> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.put<Leader>(baseURL + 'leaders/' + leader.id, leader, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
}
