class ToggleFriend{constructor(t){this.toggler=t,this.toggleFriend()}toggleFriend(){$(this.toggler).click((function(t){t.preventDefault();$.ajax({type:"post",url:$(this).attr("href")}).done((function(t){console.log(t.data.toggle),1==t.data.toggle?($(".toggle-friend-button").html("Remove Friend"),new Noty({theme:"relax",text:"Added to your friend list",type:"success",layout:"topRight",timeout:1500}).show()):($(".toggle-friend-button").html("Add Friend"),new Noty({theme:"relax",text:"Removed from your friend list",type:"error",layout:"topRight",timeout:1500}).show())}))}))}}