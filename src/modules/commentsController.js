
const showDetails = async (baseUrl) => {
    const url = baseUrl;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      return error;
    }
  };

const storeComment = async (involvmentUrl, obj) => {
  const url = `${involvmentUrl}comments`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });
      const data = await response.json();
      
      return data;
    } catch (error) {
      return error;
    }
}

const fetchComments = async (involvmentUrl,itemId) => {
    const url = `${involvmentUrl}comments?item_id=${itemId}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
          const text = await response.text();
          if (text.trim() === '') {
            return {}; 
          } else {
            const data = JSON.parse(text);
            console.log(data); 
            return data; 
          }
        } else{
          return {};
        }  
    
    } catch (error) {
      return error;
    }
  };

  const displayComments = (commentList) => {
      let commentHtml = ``;
      commentList.forEach((item) => {
        commentHtml += `<p class="bold-text text-center">${item.creation_date} ${item.username}: ${item.comment}</p>`;
      })
      document.getElementById('commentList').innerHTML = commentHtml;
  }
  
  const commentCounter = (commentList) => {
    let keys = Object.keys(commentList);
    return keys.length;
  }

  
  
  export { showDetails, fetchComments, displayComments, commentCounter, storeComment };