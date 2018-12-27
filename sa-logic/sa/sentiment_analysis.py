from os import getenv
from textblob import TextBlob
from flask import Flask, request, jsonify
from flask_api import status
from jaeger_client import Config
from flask_opentracing import FlaskTracer

JAEGER_HOST = getenv('JAEGER_HOST', 'localhost')
JAEGER_SERVICE_NAME = getenv('JAEGER_SERVICE_NAME', 'sa-logic')

app = Flask(__name__)

config = Config(config={'sampler': {'type': 'const', 'param': 1},
                        'logging': True,
                        'propagation': 'b3',
                        'local_agent':
                            {'reporting_host': JAEGER_HOST}},
                service_name=JAEGER_SERVICE_NAME)

jaeger_tracer = config.initialize_tracer()
tracer = FlaskTracer(jaeger_tracer)


@app.route("/analyse/sentiment", methods=['POST'])
@tracer.trace()
def analyse_sentiment():
    sentence = request.get_json()['sentence']
    polarity = TextBlob(sentence).sentences[0].polarity
    return jsonify(
        sentence=sentence,
        polarity=polarity
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
