import backend.augmentations.multi_query_generator as mqg

def test_multi_query_generator():
    
    generator = mqg.MultiQueryGenerator("What are the best practices for HR policies?", 2)
    queries = generator.generate_queries()
    print(queries)

test_multi_query_generator()