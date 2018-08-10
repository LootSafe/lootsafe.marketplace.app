<template>
  <div id="chat">
    <div id="chat_stats" >
      <h3 class="title">Trade Chat</h3>
      <p>
        <i class="fa fa-circle"></i>
        <span class="subtle">Users Online:</span>
        450
      </p>
    </div>

    <div id="chat_container">
      <div class="message">
        <div class="left">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADmElEQVR4Xu3dsXEUQRSE4VUAGNjYpACGIsDFJAUSIAQSIAVMHAxiUB6SjUEAoojhV1XXcJ/8p7nt90+/3rm9u7v7t4/PV/j78vopVF/X199vUv3pxWv97gCwRQgAHCARWB2UAyT5ezEH4ACJIg6Q5NsXcwAOkCjkAEm+fTEH4ACJQg6Q5NsXcwAOkCjkAEm+fTEH4ACJQg6Q5NsXcwAOkCjkAEm+ffHcAX6+e0jPA3z7/pBU/PzpfaqvOyAtfl1XbeBavzsANAQAwAESQRzACEgA1RFqBCT5ZYBrbWFCYAvRHIADuA0sDLgLcBdQ+JmPUCMgtU8InBMsBAqBcQ+3chlABkgErW+jZYDUPhlABoifjuYA3gtIHjR/LyC9+hcoPv0u4AUkSP8iZ4C0+gsUA6CJCICmX34iKC6fywEQJaznAHH5XA6AKCEAooC1XAZoCnKApp8MEPXL5RygScgBmn4cIOqXyzlAk5ADNP04QNQvl3OAJiEHaPpxgKhfLucATUIO0PTjAFG/XM4BmoTZAW69AadfPwDaBpr/4EV9MwoAAGifDTzdAmP/OQAAtr95ZATEx7I5QPyWMA7AAeomSvXVAtPi1/5n7+r1uwuIBJzugAAAgNvAwgAHGH/Zc52Bpfn/agEAgMpQqq8bQAZI8nOA4y0w9v/46+cAkQAZYJwBXv36EVvYyv98+Nj+Qay++QwAgKeE0PEjAAAASDugFhsBMkBlKNXLAEJgAkgGSPJdlxFgBESEWrkRYAQkgoyAJJ8RMD8Ldw7gHCDu4VYuBAqBjaBYLQQKgQkhITDJJwQKgae/HXz/9vG5bII6g8ra/8NDmevrvwNAa8HpGwAArf/z7wiqj6QBAAAyQGHACPD5/MJPrjUCxieRHIAD5F1c/gEH4ACFn8tdQJKv/3ZwXD6fxAIgdkAGkAEiQq1cBpABEkFGQJJPBjj+LDz2//jr5wCRgJsPgVG/vINqCLr1158d4NYFrA6wBhgAkWAA3LiAAABAUsAIiCeJawE5QOK/H6QAoDVACGz6HX8bCwAAtIdCo37H7yAZIBJwuoCnv34j4MYBBgAAZIDCgBFQ1LucA6zPMYyAGwc4f0NI1E/5WAEAjBuwXh4A6w6M1wfAuAHr5QGw7sB4fQCMG7BeHgDrDozXB8C4AevlAbDuwHh9AIwbsF4eAOsOjNcHwLgB6+UBsO7AeH0AjBuwXh4A6w6M1wfAuAHr5f8CQH3kjj2n7hgAAAAASUVORK5CYII=" />
        </div>
        <div class="right">
          <p class="name">Retro Pronghorn</p>
          <p class="time">18:24</p>
          <p class="body">Lorem ipsum dolor
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAD0klEQVR4Xu3dvXEUQRRF4V6PJFSlAJQBeFhrKQVMMlAMZIApVybWJiAyIAMCETHsfF31aqgj/02vbt8+7/b8Xr49fvpY8Pf3x0+oXuvh5TvVP/2+Ur0W//l8o0NM63fJADR/KwNEAHJQBKgFkIG0hdYCSP5VC5hGWCHQQnQEiABtA8UD7QLaBYh/1nQLrQXQ9BUCxx1cCCwE4hq28jJAGYAcVAboTCAZqDOBXQ0kA7ULIPn+g13A17dXuh9AETSd4nH+uXw6RF4yAM8hHSADDPdwmr0NxRkgA5CNdBtZCyD5vTgCRAByUQQg+eaLI0AEIBdGAJJvvjgCRAByYQQg+eaLI0AEIBdGAJJvvjgCRAByYQQg+eaLI0AEIBcyAaYfD6f/fvn7BXR8nQAdX+/HGL8jaFoAHT8D4F3BOgG6AnT8DJAB1ENUrwugFkDyL34yCofndyxlAJyBWkAtAC1k5bUAfLLI5K8FnL4HZoDhF0XqBCgCdfwyQBlAPUT1ugDaBZD8ZYAywMkJGAEiwOxr4lB/PhOm4xcCT47ADIDbQH2+X++I0Qmcrp/WjzPA9D8wPYE6/rR+GUBnEOszAH5yBfUfL88AGYBMqBmqFkDye3EEiADkoghA8s0XR4AIQC6MACTffHEEiADkwghA8s0XR4AIQC6MACTffHEEiADkwghA8s0Xn54AKqEKcHt/1p9A9dcvv6heVzANvtbiawH6AzLATSWk+gxA8q0VAVDACBAByEJlAJKvDGDy1QJUv1ULqAWQiWoBJF8twOSrBah+tYDhU+GdB0ALdx4ABSwEFgLJQoVAkq8QaPIVAlW/QmAh8EomqgWQfOv03w6evp6uIVZ/v76hJAPYAuIWlgHwkzEqIM5/BtAXFU4jNAO8vX6ICBnAQqwSrAwwvI2aJlgGyAAC8LaBpN5ahcAyQBmAFtF0D6UfHwH8y50ZwC4HFwILgQSxTgWTfIVAfl17LaAWQGtQz6TR4IXAQuA0wU4fAnUFqgA6vp4H0fH1/x8PgdMC6PgZoE+3qoeoPgL0zSIyUC2A5PMQjMPzdxszAM5AGaAMgBay8jJAGYAcVAsg+coAfC0A9ecQpOOXAcoA6iGqLwOUAchAZQCSrwxQBjh5C4wAEWD20TDUv10AZqDxt4RpilUDTddPbyMzwLADMgAibHj+ePgMkAHYRHKAWoCot6E2AkSADTY6fogIcFy7LZURIAJsMdLRg0SAo8ptqosAEWCTlY4dJgIc021bVQSIANvMdORAEeCIahtrIkAE2Gin+w8VAe7XbGtFBIgAWw1178H+AVMuJP0Ez+bRAAAAAElFTkSuQmCC" />
            <span class="item">Iron Broadsword</span>
            adipiscing elit, sed do eiusmod tempor incididunt
            ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>

    <div id="chat_compose">
      <input type="text" placeholder="hello world..." />
      <button class="circle_button">
        <i class="far fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data () {
    return {}
  }
}
</script>
