from fastapi import FastAPI


app = FastAPI(title="Blog API")

@app.get("/health")
def health():
	return {"status":"ok"}
