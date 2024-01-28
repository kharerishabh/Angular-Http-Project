import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject, catchError, map, throwError } from "rxjs";
import { Post } from "./post.model";



@Injectable({providedIn: "root"})
export class PostsService{
  error = new Subject<string>()

    constructor(private http: HttpClient){}
    
    createAndStorePost(title: string, content: string){
        const postData: Post = {title: title, content: content} 
        this.http
      .post<{name: string}>(
        'https://angular-project-563c1-default-rtdb.firebaseio.com/posts.json',
        postData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message)
      });
    }

    fetchPosts(){
       return this.http
      .get<{[key: string]: Post}>(
        'https://angular-project-563c1-default-rtdb.firebaseio.com/posts.json', {
          headers: new HttpHeaders({'Custom-Header': 'Hello'})
        }
      ).pipe(map((responseData) => {
        const postsArray: Post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postsArray.push({...responseData[key], id: key})
          }
        }
        return postsArray
      }), catchError (errorRes => {
        return throwError(errorRes)
      }))
    }

    deletePosts(){
       return this.http.delete('https://angular-project-563c1-default-rtdb.firebaseio.com/posts.json')
    }
}