export default class Modal {
    constructor() {
        this.modalWrapper = document.querySelector(".modal-overlay")
        this.modalActive = null
        
        this.createModal = document.querySelector(".modal-create")
        this.updateModal = document.querySelector(".modal-update")
        this.deleteModal = document.querySelector(".modal-delete")
    }

    open(modalType) {
        this.modalWrapper.classList.add("open")
        
        const modal = `${modalType}Modal`
        this[modal].classList.add("active")
        this.modalActive = modal
    }

    close() {
        this.modalWrapper.classList.remove("open")
        this[this.modalActive].classList.remove("active")
        this.modalActive = null
    }
}