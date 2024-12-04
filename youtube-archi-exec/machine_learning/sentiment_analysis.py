from transformers import (
    pipeline,
    RobertaConfig,
    RobertaForSequenceClassification,
    AutoTokenizer,
)

def get_pipeline():
    model_name = "cardiffnlp/twitter-roberta-base-sentiment"
    config = RobertaConfig.from_pretrained(model_name)
    config.id2label = {0: 'negative', 1: 'neutral', 2: 'positive'}
    config.label2id = {'negative': 0, 'neutral': 1, 'positive': 2}
    model = RobertaForSequenceClassification.from_pretrained(
        model_name,
        config=config,
    )
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    sentiment_pipeline = pipeline(
        "sentiment-analysis",
        model=model,
        tokenizer=tokenizer,
    )
    return sentiment_pipeline