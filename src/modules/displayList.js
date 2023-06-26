import fetchList from './fetchList.js';
import { baseUrl, involvmentUrl } from "./config.js";
import { storeLike, fetchLikes } from './likeController.js';
import { showDetails, fetchComments, displayComments, commentCounter, storeComment } from './commentsController.js';

const displayList = async () => {
    const showList  = document.getElementById('showsList');
    const res = await fetchList(baseUrl);
    let html = ``;
    res.forEach((item,i) => {
        if(i < 12){
            html += `<div class="col-md-3 mt-5">
                      <div class="card" >
                        <img src="${item.image.medium}" class="card-img-top" alt="Image">
                        <div class="card-body">
                          
                          <div class="d-flex justify-content-between align-items-center">
                              <h5 class="card-title">${item.name}</h5>
                              <i class="fa-regular fa-heart likes" data-id="${item.id}" data-liked="false"></i>
                          </div>
                          
                          <div class="row mt-2">
                              <div class="col-md-12"><span class="d-flex justify-content-end" id="likesCounter${item.id}"><span id="counter${item.id}">0 </span> Likes</span></div>
                          </div>
                          <div class="row mt-2">
                              <div class="col-md-12"><button class="btn btn-dark w-100 comments" data-showId="${item.id}" >Comments</button></div>
                          </div>
                        </div>
                       </div>
                     </div>`;
        }else{
            return false;
        }
      });
    showList.innerHTML = html;

    const likesRes = await fetchLikes(involvmentUrl);
    if (Array.isArray(likesRes)) {
      likesRes.forEach((item,i) => {
          let element = document.getElementById(`counter${item.item_id}`);
          element.textContent = item.likes;     
          let parentCardElement = element.parentElement.parentElement.parentElement.parentElement;
          let likesElement = parentCardElement.querySelector('.likes');
          likesElement.classList.remove('fa-regular');
          likesElement.classList.add('fa-solid');
          likesElement.classList.add('text-danger');
          likesElement.setAttribute('data-liked', 'true');
        });
    }  
    
    const likesclick = document.querySelectorAll('.likes');            
    likesclick.forEach((likesclick) => {
        likesclick.addEventListener('click', async (event) => {
          const target = event.target;
          const isLiked = target.getAttribute('data-liked');
          const showId = target.getAttribute('data-id');
          const counter = document.getElementById(`counter${showId}`);
            
          if(isLiked === 'false'){
            // console.log(isLiked);
            target.classList.remove('fa-regular');
            target.classList.add('fa-solid');
            target.classList.add('text-danger');
            target.setAttribute('data-liked', 'true');
            counter.textContent = parseInt(counter.textContent) + 1;
            await storeLike(involvmentUrl, showId);    
          }else {
            target.setAttribute('data-liked', 'false');
          }
          
        });
      });
    
    const commentsBtn = document.querySelectorAll('.comments');
    let modal = document.getElementById('myModal');
    commentsBtn.forEach((commentsBtn) => {
      commentsBtn.addEventListener('click', async (e) => {
          const showId = e.target.getAttribute('data-showid');
          const showDetail = await showDetails(`${baseUrl}/${showId}`);
          showComments(showId);
          modal.classList.add('show');
          modal.setAttribute('aria-hidden', 'false');
          modal.style.display = 'block';
          document.body.classList.add('modal-open');

          document.getElementById('showImage').setAttribute('src',showDetail.image.medium);
          document.getElementById('showTitle').innerHTML = showDetail.name;
          document.getElementById('showLang').innerHTML = `Language: ${showDetail.language}`;
          document.getElementById('showType').innerHTML = `Type: ${showDetail.type}`;
          document.getElementById('showPremiered').innerHTML = `Premiered: ${showDetail.premiered}`;
          document.getElementById('showEnd').innerHTML = `Ended: ${showDetail.ended}`;

          
          await addCommentForm(showId);
        
        //Adding submit event listner on comment form
        const addComment = document.getElementById('commentForm');
        addComment.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('user').value;
            const comment = document.getElementById('comment').value;

            const data = {
                    "item_id": showId,
                    "username": username,
                    "comment": comment
            }
            await storeComment(involvmentUrl, data);  
            showComments(showId);
            document.getElementById('user').value = '';
            document.getElementById('comment').value = '';
        })
      })
    })
    const closeIcon = document.getElementById('closeIcon');
    closeIcon.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    })
      
}

const showComments = async (showId) => {
  const commentList = await fetchComments(involvmentUrl,showId);
  if (Array.isArray(commentList)) {
    displayComments(commentList);
  }else{
    document.getElementById('commentList').innerHTML = '';
  }
  let commentCount = commentCounter(commentList);
  document.getElementById('commentCounter').innerHTML = commentCount;        
}
const addCommentForm = async () => {
  let form = `<form action="" class="form w-50" id="commentForm">
          <div class="form-group row justify-content-center">
            <div class="col-12">
                <input name="name" id="user" class="p-2 input border border-2 border-black d-flex right_align w-100" placeholder="Your Name" type="text">
            </div>  
          </div>
          <br>
          <div class="form-group row justify-content-center">
            <div class="col-12">
                <textarea rows="3" name="comment" id="comment" class="p-2 input border border-2 border-black d-flex right_align w-100" placeholder="Your Insights" type="text"></textarea>
            </div>  
          </div>
          <div class="form-group mt-3 row justify-content-start">
            <div class="col-12">
                <button type="submit" class="btn btn-outline-primary btn-submit d-flex ">Submit</button>
            </div>
          </div>
        </form>`;
        document.getElementById('formDiv').innerHTML = form;
}
export default displayList;