// [api.js]
import { auth } from "./firebase.mjs";

function handleResponse(res) {
  if (res.status !== 200 && res.status !== 201) {
    return res.text().then(text => {
      throw new Error(`${text} (status: ${res.status})`);
    });
  }
  return res.json();
}

async function getUID() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(); // Get the ID token
  } else {
    throw new Error("User is not authenticated.");
  }
}

export function getFridgeSnaps(fail, success) {
  getUID()
    .then(uid => fetch(`/api/users/${uid}/fridgesnaps`))
    .then(handleResponse)
    .then(success)
    .catch(fail);
}

export function getRecipes(fail, success) {
  getUID()
    .then(uid => fetch(`/api/users/${uid}/recipes`))
    .then(handleResponse)
    .then(success)
    .catch(fail);
}

// export function uploadFridgeSnap(file, uid, fail, success) {
//   const formData = new FormData();
//   formData.append("picture", file);
//   formData.append("uid", uid);

//   fetch(`/api/fridgesnap/upload`, {
//     method: "POST",
//     body: formData,
//   })
//     .then(handleResponse)
//     .then(success)
//     .catch(fail);
// }

export function generateRecipeForSnap(snapId, fail, success) {
  fetch(`/api/fridgesnap/${snapId}/generate_recipe`)
    .then(handleResponse)
    .then(success)
    .catch(fail);
}

export function getLatestImages(count, fail, success) {
  fetch(`/api/fridgesnap/0/images/${count}`)
    .then(handleResponse)
    .then(success)
    .catch(fail);
}

export function testAPI(fail, success) {
  fetch(`/api/test`)
    .then(handleResponse)
    .then(success)
    .catch(fail);
}
