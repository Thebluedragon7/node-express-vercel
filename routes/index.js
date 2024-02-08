<head>
  <!-- Include jQuery library -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <!-- Include jQuery Terminal plugin -->
  <script src="https://cdn.jsdelivr.net/npm/jquery.terminal/js/jquery.terminal.min.js"></script>
  <!-- Include jQuery Terminal CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery.terminal/css/jquery.terminal.min.css">
</head>

<body>
  <div id="terminal"></div>
  <script>
    const Domains = {
      Self: "http://localhost:10503"
    }

    $("#terminal").terminal(function (message) {
      let args = $.terminal.parse_command(message);
      let command = args.name
      let rest = args.rest

      if (command == "speak") {
        this.echo("["+new Date()+"] - You sent: "+rest)
        console.log(fetch(`${Domains.Self}/message`, {
          method: "POST",
          headers: {
            channelid: "831952145338335326",
            message: rest
          }
        }))

      }
      if (command == "talk") {
        this.echo("["+new Date()+"] - You sent: "+rest)
        let args2 = $.terminal.parse_command(rest);
        console.log(args2)
        console.log(fetch(`${Domains.Self}/message`, {
          method: "POST",
          headers: {
            channelid: args2.name,
            message: args2.rest
          }
        }))

      }
      if (command == "announce") {
        this.echo("["+new Date()+"] - You sent: "+rest)
        console.log(fetch(`${Domains.Self}/message`, {
          method: "POST",
          headers: {
            channelid: "831952145086939180",
            message: rest
          }
        }))

      }

    });
  </script>
</body>
