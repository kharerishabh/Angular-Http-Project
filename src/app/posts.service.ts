import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, catchError, map, tap, throwError } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        'https://angular-project-563c1-default-rtdb.firebaseio.com/posts.json',
        postData, {
          observe: 'response'
        }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams()
    searchParams = searchParams.append('print', 'pretty')
    searchParams = searchParams.append('custom', 'key')
    return this.http
      .get<{ [key: string]: Post }>(
        'https://angular-project-563c1-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          params: searchParams
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://angular-project-563c1-default-rtdb.firebaseio.com/posts.json', {
        observe: 'events'
      }
    ).pipe(tap(events => {console.log(events)
      if(events.type === HttpEventType.Sent){
        //...
      }
    if(events.type === HttpEventType.Response){
      console.log(events.body)
    }
    }))
  }
}
