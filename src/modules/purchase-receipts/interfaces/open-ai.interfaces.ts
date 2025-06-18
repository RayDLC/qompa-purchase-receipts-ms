export interface ReqBodyAskGpt {
  model: string;
  instructions: string;
  input: string;
}

export interface ResBodyAskGpt {
    id:                   string;
    object:               string;
    created_at:           number;
    status:               string;
    background:           boolean;
    error:                null;
    incomplete_details:   null;
    instructions:         string;
    max_output_tokens:    null;
    model:                string;
    output:               Output[];
    parallel_tool_calls:  boolean;
    previous_response_id: null;
    reasoning:            Reasoning;
    service_tier:         string;
    store:                boolean;
    temperature:          number;
    text:                 Text;
    tool_choice:          string;
    tools:                any[];
    top_p:                number;
    truncation:           string;
    usage:                Usage;
    user:                 null;
    metadata:             Metadata;
}

interface Metadata {
}

interface Output {
    id:      string;
    type:    string;
    status:  string;
    content: Content[];
    role:    string;
}

interface Content {
    type:        string;
    annotations: any[];
    text:        string;
}

interface Reasoning {
    effort:  null;
    summary: null;
}

interface Text {
    format: Format;
}

interface Format {
    type: string;
}

interface Usage {
    input_tokens:          number;
    input_tokens_details:  InputTokensDetails;
    output_tokens:         number;
    output_tokens_details: OutputTokensDetails;
    total_tokens:          number;
}

interface InputTokensDetails {
    cached_tokens: number;
}

interface OutputTokensDetails {
    reasoning_tokens: number;
}