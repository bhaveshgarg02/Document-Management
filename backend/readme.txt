GET http://127.0.0.1:8000/api/documents

GET http://127.0.0.1:8000/api/documents/1

POST  http://127.0.0.1:8000/api/documents

{
    "name": "document3.txt",
    "content": "This is the content of the new document3."
}

GET http://127.0.0.1:8000/api/documents?sort_by=created_at&sort_order=desc

GET http://127.0.0.1:8000/api/documents?sort_by=name&sort_order=asc

GET http://127.0.0.1:8000/api/documents?sort_by=size&sort_order=asc

DELETE  http://127.0.0.1:8000/api/documents/1