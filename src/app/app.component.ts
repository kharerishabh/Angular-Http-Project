import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostsService } from './posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy{
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  errSub: Subscription

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.errSub = this.postsService.error.subscribe(errorMessage => {
      this.error = errorMessage
    })
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false
      this.error = error.message
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.isFetching = false
      this.error = error.message
    });
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe(() => {
      this.loadedPosts = []
    })
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
      this.errSub.unsubscribe()
  }
  
}
