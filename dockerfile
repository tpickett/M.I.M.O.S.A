FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -U flask-cors

COPY . .

EXPOSE 5000 

CMD [ "python", "./app.py" ]