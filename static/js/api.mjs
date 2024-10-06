function handleResponse(res){
	if (res.status != 200 && res.status != 201) { return res.text().then(text => { throw new Error(`${text} (status: ${res.status})`)}); }
	return res.json();
}

export function getFridgeSnaps(uid, fail, success) {
    fetch("/api/users/"+uid+"/fridgesnaps")
        .then(handleResponse)
        .then(success)
        .catch(fail);
}