const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0){
let url = new URL(window.location.href);

    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            if(status){
                url.searchParams.set("status",status);
            } else {
                url.searchParams.delete("status");
            }

            url.searchParams.delete("keyword");
            window.location.href = url.href;
        });
    });
}

const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = formSearch.parentElement.querySelector(".form-control").value;
        console.log(keyword);
        if(keyword){
            url.searchParams.set("keyword",keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
}

const paginations = document.querySelectorAll("[button-pagination]");
if(paginations){
    let url = new URL(window.location.href);

    paginations.forEach((pagination) => {
        pagination.addEventListener("click", () => {
            const pageIndex = pagination.getAttribute("button-pagination");
            if(pageIndex){
                url.searchParams.set("page",pageIndex);
            } else {
                url.searchParams.delete("page");
            }

            window.location.href = url.href;
        });
    })
}

const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0){
    const formChangeStatus = document.querySelector("[form-change-status]");
    const path = formChangeStatus.getAttribute("data-path");

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () =>{
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            const statusChange = statusCurrent == "active" ? "inactive" : "active";
            console.log(statusChange);

            const action = `${path}/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}

const checkBoxMulti = document.querySelector("[checkbox-multi]");
if(checkBoxMulti){
    const inputCheckAll = checkBoxMulti.querySelector("input[name='checkall']");
    const inputCheckIds = checkBoxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputCheckIds.forEach(input => {
                input.checked = true;
            });
        } else {
            inputCheckIds.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputCheckIds.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked").length;
            if(countChecked == inputCheckIds.length)
                inputCheckAll.checked = true;
            else inputCheckAll.checked = false;
        });
    });
}

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const type = e.target.elements.type.value;
    
        if(type == "delete-all") {
          const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
          if(!isConfirm) {
            return;
          }
        }    

        const inputChecked = document.querySelectorAll("input[name='id']:checked");
        
        if(inputChecked.length > 0){
            const ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            
            inputChecked.forEach(input => {
                const id = input.value;
                if(type == "change-position"){
                    const position = input
                    .closest("tr")
                    .querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                    console.log(`${id}-${position}`);
                }
                else{
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        }
        else{
            alert("Vui lòng chọn ít nhất một bản ghi!");
        }
    })
}

const deleteButtons = document.querySelectorAll("[button-delete]");
if(deleteButtons.length > 0){
    const formDelete = document.querySelector("[form-delete-item]");
    const path = formDelete.getAttribute("data-path");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
    
            const isComfirm = confirm("Bạn có chắc chắn muốn xóa bản ghi này?");

            if(isComfirm){
                const id = button.getAttribute("data-id");
                const action = `${path}/${id}?_method=DELETE`;

                formDelete.action = action;

                formDelete.submit();
            }
        })
    });
}

const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
    const closeAlert = showAlert.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}

const sort = document.querySelector("[sort]");
if(sort){
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", () =>{
        const [sortKey, sortValue] = sortSelect.value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
    
        window.location.href = url.href;
      });

    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue){
        const string = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value="${string}"]`);
        optionSelected.selected=true;
    }
}