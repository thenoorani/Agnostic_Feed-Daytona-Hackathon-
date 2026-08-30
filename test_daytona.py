import os
from daytona import Daytona
from dotenv import load_dotenv

# Load the environment variables from .env
load_dotenv()

def main():
    print("Initializing Daytona SDK...")
    daytona = Daytona()
    
    print("Creating sandbox...")
    sandbox = daytona.create()
    
    print("Running command in sandbox...")
    response = sandbox.process.exec("echo 'Hello from Daytona Sandbox!'")
    print("Result:", response.result)

if __name__ == "__main__":
    main()
