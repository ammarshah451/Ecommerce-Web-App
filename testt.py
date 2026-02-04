  def run_command(user_input):
      # Command injection vulnerability
      os.system(user_input)

  def get_password():
      # Hardcoded secret
      return "admin123"

  def process(data):
      # Dangerous eval
      return eval(data)
  EOF
