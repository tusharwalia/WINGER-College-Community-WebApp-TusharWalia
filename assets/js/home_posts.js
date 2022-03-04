{
    //method to submit form data for new post using ajax
    let createPost = function(){
        
        let newPostForm = $('#new-post-form');
        
        newPostForm.submit(function(e){
            e.preventDefault();
            var dataForm = new FormData(newPostForm[0]);

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data:dataForm,
                processData: false,
                contentType: false,

                success: function(data){
                    //console.log(data);
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
              
                    //call create comment class
                    new PostComments(data.data.post._id);

                    //enable functionality of toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));


                    new Noty({
                        theme: 'relax',
                        text: "Post published successfully!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                    
              
                }, error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


    //method to create a post in DOM

    let newPostDom = function(post){
        return $(`<li id="post-${post._id}"> 
                    <P>

                    <img id="post-pic" src="${post.post_image}" alt="${post.user.name}" width="7000px" >

                       <br>
                        <small>
                                <a class="delete-post-button" href="/posts/destroy/${ post._id }">delete</a>
                        </small>
                       
                    <br>
                        ${post.content}
                        <br>
                        <small>
                        ${ post.user.name }
                        </small>

                        <br>
                        <small>
        
                            <a class="toggle-like-button" data-likes="<%= post.likes.length %>" href="/likes/toggle/?id=<%=post._id%>&type=Post">
                                0 Likes
                            </a>
            
                        </small>
                    </P>
                    
                    <div class="post-comments">
                      
                        
                            <form id="post-${post._id}-comments-form" action="/comments/create" method="post">
                    
                                <input type="text" name="content" placeholder="add comment" required>
                    
                                <!-- giving hidden data to each comment so that we know to which post the comment is related -->
                                <input type="hidden" name="post" value="${post._id }" >
                                <input type="submit" value="Add Comment">
                            </form>
                        
                        
                          
                    
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
                                   
                                </ul>
                    
                    </div>
                    
                    </li>`)
    }
   
    //method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
              
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
               
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
               
                }, error:function(error){
                    console.log(error.responseText);
                }
            });
        });
    }


      // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class created) to the delete button of each
      let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }

    createPost();
    convertPostsToAjax();
}