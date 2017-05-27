let $signUpForm = $('form[name=signUp]')
$signUpForm.on('submit', (e) => {
  e.preventDefault()
  let string = $signUpForm.serialize() // 表单序列化
  $.ajax({
    url: $signUpForm.attr('action'),
    method: $signUpForm.attr('method'),
    data: string,
    success(response) {
      let object = JSON.parse(response)
      console.log(object)
    }
  })
})