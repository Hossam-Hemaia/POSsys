const socket = io();
socket.on("connect", () => {
  console.log("connected to socket: " + socket.id);
});
// socket.on("role_created", (event) => {
//   console.log(event);
//   const roleLnk = document.getElementById("roleLnk");
//   roleLnk.click();
//   //   const roleTable = document.getElementById("roleTbl");
//   //   const rowDiv = document.createElement("div").classList.add("row-body");
//   //   const roleNameDiv = (document.createElement("div").innerText =
//   //     event.roleName);
//   //   const rowActionsDiv = document
//   //     .createElement("div")
//   //     .classList.add("row-actions");
//   //   const iconSpan1 = document
//   //     .createElement("span")
//   //     .classList.add("icon-container");
//   //   const iconSpan2 = document
//   //     .createElement("span")
//   //     .classList.add("icon-container");
//   //   const iconImg1 = (document.createElement("img").src = "/img/icons/edit.png");
//   //   const iconImg2 = (document.createElement("img").src =
//   //     "/img/icons/delete.png");
//   //   iconSpan1.appendChild(iconImg1);
//   //   iconSpan2.appendChild(iconImg2);
//   //   rowActionsDiv.append(iconSpan1, iconSpan2);
//   //   rowDiv.append(roleNameDiv, rowActionsDiv);
//   //   roleTable.append(rowDiv);
// });
