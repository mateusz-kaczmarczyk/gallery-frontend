<script>
import dayjs from "dayjs";


  export let comment;
</script>

<div class="media">
  <figure class="media-left">
    <p class="image is-64x64">
      <img src={comment.user.avatar} alt="" />
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>{comment.user.username}</strong>
        <small class="ml-4">{dayjs(comment.createdAt).format('DD.MM.YYYY r. HH:mm')}</small>
        <br />
        {comment.content}
        <br />
      </p>
    </div>
  </div>
</div>